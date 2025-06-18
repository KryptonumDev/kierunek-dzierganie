'use server';
import { CoursesProgress } from '@/global/types';
import type { QueryData } from '@supabase/supabase-js';
import { createClient } from './supabase-admin';

export async function updateElement(progress: CoursesProgress) {
  const supabase = createClient();
  const updateDataQuery = supabase.from('courses_progress').update(progress).eq('id', progress.id).select('*');

  type UpdateData = QueryData<typeof updateDataQuery>;

  const { data, error } = await updateDataQuery;

  if (error) throw error;

  return data as UpdateData;
}
