// app/courses/[courseId]/page.tsx
"use client"

import { BookOpen, ChevronLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCourse: Course = {
      id: params.courseId as string,
      title: "React Fundamentals",
      description: "Learn the basics of React including components, state, props, and more.",
      thumbnail_url: "/api/placeholder/800/400",
      price: 99,
      lessons: [
        { id: '1', title: 'Introduction to React', content: 'Welcome to React', course_id: params.courseId as string },
        { id: '2', title: 'Components and Props', content: 'Building blocks', course_id: params.courseId as string },
        { id: '3', title: 'State and Lifecycle', content: 'Managing state', course_id: params.courseId as string },
        { id: '4', title: 'Handling Events', content: 'Event handling', course_id: params.courseId as string },
        { id: '5', title: 'Lists and Keys', content: '', course_id: params.courseId as string },
        { id: '6', title: 'Forms and Controlled Components', content: '', course_id: params.courseId as string },
        { id: '7', title: 'Lifting State Up', content: '', course_id: params.courseId as string },
        { id: '8', title: 'Hooks Overview', content: '', course_id: params.courseId as string },
      ]
    };

    const mockProgress: Progress[] = [
      {
        id: '1',
        user_id: 'user1',
        lesson_id: '1',
        completed: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: 'user1',
        lesson_id: '2',
        completed: true,
        created_at: new Date().toISOString()
      }
    ];

    setCourse(mockCourse);
    setProgress(mockProgress);
  }, [params.courseId]);

  const handleStartLesson = (lessonId: string) => {
    router.push(`/courses/${params.courseId}/lessons/${lessonId}`);
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard" 
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-500 mr-2" />
            <span>{course.lessons.length * 30} mins</span>
          </div>
          <div className="flex items-center">
          <BookOpen className="w-5 h-5 text-gray-500 mr-2" />
          <span>{course.lessons.length} lessons</span>
        </div>
      </div>
    </div>

    {/* Course Content */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Course Content</h2>
      <div className="space-y-4">
        {course.lessons.map((lesson, index) => {
          const isCompleted = progress.some(p => p.lesson_id === lesson.id && p.completed);
          const hasContent = lesson.content !== '';
          
          return (
            <div 
              key={lesson.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100 text-green-600' : 
                  hasContent ? 'bg-gray-100 text-gray-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium">{lesson.title}</h3>
                  <p className="text-sm text-gray-500">30 mins</p>
                </div>
              </div>
              <button 
                onClick={() => handleStartLesson(lesson.id)}
                disabled={!hasContent}
                className={`px-4 py-2 rounded-full ${
                  isCompleted 
                    ? 'bg-green-100 text-green-600' 
                    : hasContent
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCompleted ? 'Completed' : hasContent ? 'Start Lesson' : 'Coming Soon'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
    </div>
);
}