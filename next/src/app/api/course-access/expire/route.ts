import { NextRequest, NextResponse } from 'next/server';
import sanityFetch from '@/utils/sanity.fetch';
import { createClient } from '@/utils/supabase-admin';
import { removeFromGroup } from '../../payment/complete/mailer-lite';

export const dynamic = 'force-dynamic';

const BATCH_SIZE = 100;

type ExpiredCourseAccessRow = {
  id: number;
  owner_id: string;
  course_id: string;
  access_expires_at: string;
};

type ProfileContact = {
  id: string;
  email?: string | null;
  billing_data?: {
    email?: string | null;
  } | null;
};

type CourseMailerLiteConfig = {
  _id: string;
  automatizationId?: string | null;
};

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();
  const nowIso = new Date().toISOString();

  const { data: expiredAccessRows, error: expiredAccessError } = await supabase
    .from('courses_progress')
    .select('id, owner_id, course_id, access_expires_at')
    .not('access_expires_at', 'is', null)
    .lte('access_expires_at', nowIso)
    .is('mailerlite_access_removed_at', null)
    .order('access_expires_at', { ascending: true })
    .limit(BATCH_SIZE)
    .returns<ExpiredCourseAccessRow[]>();

  if (expiredAccessError) {
    return NextResponse.json(
      { error: 'Failed to fetch expired course access rows', details: expiredAccessError.message },
      { status: 500 }
    );
  }

  if (!expiredAccessRows || expiredAccessRows.length === 0) {
    return NextResponse.json({
      ok: true,
      processed: 0,
      removedFromBuyerGroups: 0,
      skippedMissingGroup: 0,
      skippedMissingEmail: 0,
      failed: 0,
    });
  }

  const ownerIds = Array.from(new Set(expiredAccessRows.map((row) => row.owner_id)));
  const courseIds = Array.from(new Set(expiredAccessRows.map((row) => row.course_id)));

  const [{ data: profileContacts, error: profileContactsError }, courseConfigs] = await Promise.all([
    supabase.from('profiles').select('id, email, billing_data').in('id', ownerIds).returns<ProfileContact[]>(),
    sanityFetch<CourseMailerLiteConfig[]>({
      query: '*[_type == "course" && _id in $courseIds]{_id, automatizationId}',
      params: { courseIds },
      noCache: true,
    }),
  ]);

  if (profileContactsError) {
    return NextResponse.json(
      { error: 'Failed to fetch profile contacts for expired course access cleanup', details: profileContactsError.message },
      { status: 500 }
    );
  }

  const profileMap = new Map(profileContacts?.map((profile) => [profile.id, profile]));
  const courseConfigMap = new Map(courseConfigs.map((course) => [course._id, course]));

  const processedIds: number[] = [];
  const failedIds: number[] = [];
  let removedFromBuyerGroups = 0;
  let skippedMissingGroup = 0;
  let skippedMissingEmail = 0;

  for (const expiredRow of expiredAccessRows) {
    const profile = profileMap.get(expiredRow.owner_id);
    const email = profile?.email || profile?.billing_data?.email || null;
    const buyerGroupId = courseConfigMap.get(expiredRow.course_id)?.automatizationId || null;

    if (!buyerGroupId) {
      skippedMissingGroup++;
      processedIds.push(expiredRow.id);
      continue;
    }

    if (!email) {
      skippedMissingEmail++;
      processedIds.push(expiredRow.id);
      continue;
    }

    try {
      await removeFromGroup(email, buyerGroupId);
      removedFromBuyerGroups++;
      processedIds.push(expiredRow.id);
    } catch (error) {
      console.error('Failed to remove expired user from MailerLite buyer group', {
        courseProgressId: expiredRow.id,
        ownerId: expiredRow.owner_id,
        courseId: expiredRow.course_id,
        error,
      });
      failedIds.push(expiredRow.id);
    }
  }

  if (processedIds.length > 0) {
    const { error: updateError } = await supabase
      .from('courses_progress')
      .update({ mailerlite_access_removed_at: nowIso })
      .in('id', processedIds);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to mark MailerLite cleanup rows as processed', details: updateError.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    ok: true,
    processed: processedIds.length,
    removedFromBuyerGroups,
    skippedMissingGroup,
    skippedMissingEmail,
    failed: failedIds.length,
    remainingInBatch: expiredAccessRows.length - processedIds.length - failedIds.length,
  });
}
