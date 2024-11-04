// app/courses/[courseId]/lessons/[lessonId]/page.tsx
"use client"

import { CheckCircle, ChevronLeft, Clock, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Lesson {
  id: string;
  title: string;
  content: string;
  course_id: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  price: number;
  lessons: Lesson[];
}

interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  created_at: string;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCourse: Course = {
        id: params.courseId as string,
        title: "React Fundamentals",
        description: "Learn the basics of React",
        lessons: [
            {
                id: "1",
                title: "Introduction to React",
                content: `# Introduction to React\n\nReact is a JavaScript library for building user interfaces...`,
                course_id: params.courseId as string
            },
            {
                id: "2",
                title: "Components and Props",
                content: `# Components and Props\n\nComponents let you split the UI into independent...`,
                course_id: params.courseId as string
            },
            // Add more lessons with empty content for loading states
            {
                id: "3",
                title: "State and Events",
                content: "",
                course_id: params.courseId as string
            },
            // ... more lessons
        ],
        price: 0
    };

    setCourse(mockCourse);
    setCurrentLesson(
      mockCourse.lessons.find(lesson => lesson.id === params.lessonId) || null
    );
  }, [params.courseId, params.lessonId]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Mock API call - replace with actual implementation
      const newProgress: Progress = {
        id: Date.now().toString(),
        user_id: 'user1',
        lesson_id: currentLesson!.id,
        completed: true,
        created_at: new Date().toISOString()
      };
      setProgress([...progress, newProgress]);

      // Navigate to next lesson if available
      if (course && currentLesson) {
        const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
        if (currentIndex < course.lessons.length - 1) {
          const nextLesson = course.lessons[currentIndex + 1];
          router.push(`/courses/${course.id}/lessons/${nextLesson.id}`);
        } else {
          router.push(`/courses/${course.id}`);
        }
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.completed);
  };

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
  const previousLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;
  const isLessonInDevelopment = !currentLesson.content;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                href={`/courses/${course.id}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Course
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                Lesson {currentIndex + 1} of {course.lessons.length}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <article className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold mb-6">{currentLesson.title}</h1>
            {isLessonInDevelopment ? (
              <div className="space-y-4">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-lg">
                  This lesson is coming soon! Check back later.
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
              </div>
            )}

            {/* Navigation and Complete Button */}
            <div className="mt-8 flex justify-between items-center pt-6 border-t">
              {previousLesson ? (
                <Link
                  href={`/courses/${course.id}/lessons/${previousLesson.id}`}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Previous Lesson
                </Link>
              ) : (
                <div></div>
              )}
              
              {!isLessonInDevelopment && (
                <button
                  onClick={handleComplete}
                  disabled={isCompleting || isLessonCompleted(currentLesson.id)}
                  className={`px-6 py-3 rounded-full flex items-center ${
                    isLessonCompleted(currentLesson.id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLessonCompleted(currentLesson.id) ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      {isCompleting ? (
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      )}
                      Complete & Continue
                    </>
                  )}
                </button>
              )}
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.id}/lessons/${lesson.id}`}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    lesson.id === currentLesson.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-shrink-0 mr-3">
                    {isLessonCompleted(lesson.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : !lesson.content ? (
                      <Clock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">
                      {index + 1}. {lesson.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}