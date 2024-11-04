// src/lib/course.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getCourse(courseId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: course, error } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('id', courseId)
    .single();

  if (error) throw error;
  return course;
}

export async function getUserCourses(userId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('*, course:courses(*)')
    .eq('user_id', userId)
    .eq('payment_status', 'completed');

  if (error) throw error;
  return enrollments;
}

export async function getLesson(lessonId: string) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) throw error;
  return lesson;
}

export async function updateProgress(userId: string, lessonId: string, completed: boolean) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    });

  if (error) throw error;
  return data;
}