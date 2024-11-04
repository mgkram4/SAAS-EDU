
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import CourseFilters from './CourseFilters';
import CourseGrid from './CourseGrid';

export default async function CoursesPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
  const { data: initialCourses } = await supabase
    .from('courses')
    .select()
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Courses</h1>
        <Suspense fallback={<div>Loading filters...</div>}>
          <CourseFilters />
        </Suspense>
      </div>

      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        }
      >
        <CourseGrid initialCourses={initialCourses || []} />
      </Suspense>
    </div>
  );
}