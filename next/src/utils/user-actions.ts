'use server';

import { createClient } from '@/utils/supabase-server';

export type ProductUserData = {
  firstName?: string;
  ownedCourses: string[];
};

export async function getProductUserData(): Promise<ProductUserData> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ownedCourses: [] };
  }

  const { data } = await supabase
    .from('profiles')
    .select(
      `
        billing_data->firstName,
        courses_progress (
          course_id
        )
      `
    )
    .eq('id', user.id)
    .single();

  return {
    firstName: (data?.firstName as string) || undefined,
    ownedCourses: data?.courses_progress?.map((course: { course_id: string }) => course.course_id as string) ?? [],
  };
}
