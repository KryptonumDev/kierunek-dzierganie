import { isCourseAccessActive } from '@/utils/course-access';
import sanityFetch, { sanityPatchQuantity, sanityPatchQuantityInVariant } from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';
import { addToGroup, removeFromGroup } from './mailer-lite';

type CourseAccessPolicy = {
  _id: string;
  accessMode?: 'unlimited' | 'duration_months' | 'fixed_date';
  accessDurationMonths?: number | null;
  accessFixedDate?: string | null;
  automatizationId?: string | null;
  previewGroupMailerLite?: string | null;
};

type CourseProductLink = {
  _id: string;
  automatizationId?: string;
  previewGroupMailerLite?: string;
};

type ExistingCourseProgress = {
  id: number;
  course_id: string;
  owner_id: string;
  access_expires_at?: string | null;
};

function getTimeZoneOffset(timeZone: string, date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedParts = formatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});

  const asUtc = Date.UTC(
    Number(formattedParts.year),
    Number(formattedParts.month) - 1,
    Number(formattedParts.day),
    Number(formattedParts.hour),
    Number(formattedParts.minute),
    Number(formattedParts.second)
  );

  return asUtc - date.getTime();
}

function createWarsawEndOfDayTimestamp(dateString: string) {
  const [yearString, monthString, dayString] = dateString.split('-');
  if (!yearString || !monthString || !dayString) {
    throw new Error(`Invalid fixed access date: ${dateString}`);
  }

  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  let utcGuess = Date.UTC(year, month - 1, day, 23, 59, 59, 999);

  for (let iteration = 0; iteration < 2; iteration++) {
    const offset = getTimeZoneOffset('Europe/Warsaw', new Date(utcGuess));
    utcGuess = Date.UTC(year, month - 1, day, 23, 59, 59, 999) - offset;
  }

  return new Date(utcGuess).toISOString();
}

function addMonthsClamped(baseDate: Date, monthsToAdd: number) {
  const targetMonthIndex = baseDate.getUTCMonth() + monthsToAdd;
  const targetYear = baseDate.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  const targetDay = Math.min(baseDate.getUTCDate(), lastDayOfTargetMonth);

  return new Date(
    Date.UTC(
      targetYear,
      normalizedMonth,
      targetDay,
      baseDate.getUTCHours(),
      baseDate.getUTCMinutes(),
      baseDate.getUTCSeconds(),
      baseDate.getUTCMilliseconds()
    )
  );
}

function resolveCourseAccessWindow(policy: CourseAccessPolicy | undefined, grantedAt: string) {
  if (!policy || !policy.accessMode || policy.accessMode === 'unlimited') {
    return {
      access_granted_at: grantedAt,
      access_expires_at: null,
    };
  }

  if (policy.accessMode === 'duration_months') {
    const months = Number(policy.accessDurationMonths ?? 0);
    if (!Number.isInteger(months) || months <= 0) {
      return {
        access_granted_at: grantedAt,
        access_expires_at: null,
      };
    }

    return {
      access_granted_at: grantedAt,
      access_expires_at: addMonthsClamped(new Date(grantedAt), months).toISOString(),
    };
  }

  if (policy.accessMode === 'fixed_date' && policy.accessFixedDate) {
    return {
      access_granted_at: grantedAt,
      access_expires_at: createWarsawEndOfDayTimestamp(policy.accessFixedDate),
    };
  }

  return {
    access_granted_at: grantedAt,
    access_expires_at: null,
  };
}

async function syncCourseAccessMailerLite({
  email,
  name,
  buyerGroupId,
  previewGroupId,
}: {
  email?: string | null;
  name?: string | null;
  buyerGroupId?: string | null;
  previewGroupId?: string | null;
}) {
  if (!email) return;

  if (buyerGroupId) {
    try {
      const res = await addToGroup(email, name || '', buyerGroupId);
      console.log('Add to group', res);
    } catch (error) {
      console.error('Error while adding to MailerLite buyer group', error);
    }
  }

  if (previewGroupId) {
    try {
      const res = await removeFromGroup(email, previewGroupId);
      console.log('Remove from preview group', res);
    } catch (error) {
      console.error('Error while removing from MailerLite preview group', error);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateItemsQuantity(data: any) {
  const supabase = createClient();
  const purchasedCourseIds = Array.from(
    new Set(
      (data?.products?.array ?? [])
        .flatMap((product: { courses?: CourseProductLink[] | null }) => product.courses?.map((course) => course._id) ?? [])
        .filter(Boolean)
    )
  );
  const accessGrantedAt = data?.paid_at ?? data?.created_at ?? new Date().toISOString();

  const courseAccessPolicies = purchasedCourseIds.length
    ? await sanityFetch<CourseAccessPolicy[]>({
        query: /* groq */ `
          *[_type == "course" && _id in $courseIds]{
            _id,
            accessMode,
            accessDurationMonths,
            accessFixedDate,
            automatizationId,
            previewGroupMailerLite
          }
        `,
        params: { courseIds: purchasedCourseIds },
        noCache: true,
      })
    : [];
  const courseAccessPolicyMap = new Map(courseAccessPolicies.map((policy) => [policy._id, policy]));

  const res = await data?.products.array.map(
    async (product: {
      quantity: number;
      type: string;
      variantId: string;
      id: string;
      automatizationId?: string;
      courses: null | CourseProductLink[];
    }) => {
      // create courses_progress record for each course (skip for guest orders)
      if (product.courses && data.user_id) {
        console.log('Produkt z kursem:', product);
        const newCourses = product.courses.map(async (el) => {
          const { data: existingProgress } = await supabase
            .from('courses_progress')
            .select('id, course_id, owner_id, access_expires_at')
            .eq('owner_id', data.user_id)
            .eq('course_id', el._id)
            .maybeSingle<ExistingCourseProgress>();

          const coursePolicy = courseAccessPolicyMap.get(el._id);
          const accessWindow = resolveCourseAccessWindow(coursePolicy, accessGrantedAt);
          const buyerGroupId = coursePolicy?.automatizationId ?? el.automatizationId;
          const previewGroupId = coursePolicy?.previewGroupMailerLite ?? el.previewGroupMailerLite;

          if (existingProgress) {
            if (isCourseAccessActive(existingProgress)) {
              console.log(`Active access already exists for user ${data.user_id} and course ${el._id}`);
              return null;
            }

            const updateResult = await supabase
              .from('courses_progress')
              .update({
                access_granted_at: accessWindow.access_granted_at,
                access_expires_at: accessWindow.access_expires_at,
                access_source_order_id: data.id,
                mailerlite_access_removed_at: null,
              })
              .eq('id', existingProgress.id);

            console.log(`Reactivated access for user ${data.user_id} and course ${el._id}`, updateResult);
            await syncCourseAccessMailerLite({
              email: data.billing?.email,
              name: data.billing?.firstName,
              buyerGroupId,
              previewGroupId,
            });
            return null;
          }

          await syncCourseAccessMailerLite({
            email: data.billing?.email,
            name: data.billing?.firstName,
            buyerGroupId,
            previewGroupId,
          });

          return {
            owner_id: data.user_id,
            course_id: el._id,
            progress: null,
            access_granted_at: accessWindow.access_granted_at,
            access_expires_at: accessWindow.access_expires_at,
            access_source_order_id: data.id,
            mailerlite_access_removed_at: null,
          };
        });
        const promiseContent = await Promise.all(newCourses);
        const filteredPromiseContent = promiseContent.filter((course) => course !== null);
        console.log('Promises', filteredPromiseContent);
        if (filteredPromiseContent.length > 0) {
          const res = await supabase.from('courses_progress').insert(filteredPromiseContent);
          console.log('Add progress', res);
        }
      } else if (product.courses && !data.user_id) {
        console.log('Skipping course progress creation for guest order');
      }

      // TODO: maybe move this to create step??
      if (product.variantId) {
        // decrease quantity of chosen variant of variable product
        try {
          const res = await sanityPatchQuantityInVariant(product.id, product.variantId, product.quantity);
          console.log('Update variant quantity', res);
        } catch (error) {
          console.error('Error while updating variant quantity', error);
        }

        // Add to MailerLite group if variant product has automatizationId
        if (product.automatizationId) {
          try {
            const addToGroupData = {
              email: data.billing?.email,
              name: data.billing?.firstName,
              group: product.automatizationId,
            };
            console.log('Add variant product buyer to MailerLite group:', addToGroupData);
            const res = await addToGroup(addToGroupData.email, addToGroupData.name, addToGroupData.group);
            console.log('MailerLite response for variant product:', res);
          } catch (error) {
            console.error('Error while adding variant product buyer to MailerLite group:', error);
          }
        }
      } else if (product.type === 'product') {
        // decrease quantity of each physical product
        try {
          const res = await sanityPatchQuantity(product.id, product.quantity);
          console.log('Update product quantity', res);
        } catch (error) {
          console.error('Error while updating product quantity', error);
        }

        // Add to MailerLite group if physical product has automatizationId
        if (product.automatizationId) {
          try {
            const addToGroupData = {
              email: data.billing?.email,
              name: data.billing?.firstName,
              group: product.automatizationId,
            };
            console.log('Add physical product buyer to MailerLite group:', addToGroupData);
            const res = await addToGroup(addToGroupData.email, addToGroupData.name, addToGroupData.group);
            console.log('MailerLite response for physical product:', res);
          } catch (error) {
            console.error('Error while adding physical product buyer to MailerLite group:', error);
          }
        }
      }
    }
  );
  console.log('Promises ', res);
  const promiseResult = await Promise.all(res);
  console.log('Promise result ', promiseResult);
}
