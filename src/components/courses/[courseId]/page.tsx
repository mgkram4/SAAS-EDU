
import CourseViewer from '@/components/course_manager';
import EnrollButton from '@/components/ui/EnrollButton';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';

export default async function CoursePage({
  params: { courseId }
}: {
  params: { courseId: string }
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: { session } } = await supabase.auth.getSession();

  // Fetch course with lessons
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select(`
      *,
      lessons (
        *,
        progress (*)
      )
    `)
    .eq('id', courseId)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Fetch enrollment if user is logged in
  const { data: enrollment } = session ? await supabase
    .from('enrollments')
    .select()
    .eq('user_id', session.user.id)
    .eq('course_id', courseId)
    .single() : { data: null };

  // Fetch progress for enrolled users
  const { data: progress } = enrollment ? await supabase
    .from('progress')
    .select()
    .eq('user_id', session.user.id)
    .in('lesson_id', course.lessons.map(l => l.id)) : { data: [] };

  // Show course viewer for enrolled users
  if (enrollment) {
    return (
      <CourseViewer
        course={course}
        currentLesson={course.lessons[0]}
        progress={progress || []}
        onLessonComplete={async (lessonId) => {
          'use server';
          // Handle lesson completion on the server
          await supabase
            .from('progress')
            .upsert({
              user_id: session!.user.id,
              lesson_id: lessonId,
              completed: true
            });
        }}
      />
    );
  }

  // Show course details and enrollment option for non-enrolled users
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-500 mb-8">{course.description}</p>
      
      <div className="aspect-video relative mb-8">
        <Image
          src={course.thumbnail_url || '/api/placeholder/800/450'}
          alt={course.title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-bold">${course.price}</p>
          <p className="text-sm text-gray-500">One-time payment</p>
        </div>
        <EnrollButton courseId={course.id} />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Course Content</h2>
        <div className="space-y-2">
          {course.lessons.map((lesson: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: number) => (
            <div
              key={lesson.id}
              className="p-4 rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                <span className="text-gray-500">Lesson {index + 1}</span>
                <h3 className="font-medium">{lesson.title}</h3>
              </div>
              {!session && (
                <span className="text-sm text-gray-500">
                  Login to enroll
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}