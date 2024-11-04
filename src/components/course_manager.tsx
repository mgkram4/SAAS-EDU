
import { Course, Lesson, ProgressType } from '@/types/course';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Progress } from './ui/progress';


export default function CourseViewer({ 
  course, 
  currentLesson,
  progress,
  onLessonComplete 
}: { 
  course: Course & { lessons: Lesson[] }
  currentLesson: Lesson
  progress: ProgressType[]
  onLessonComplete: (lessonId: string) => void
}) {
  const [activeLesson, setActiveLesson] = useState(currentLesson);

  const completedLessons = progress.filter(p => p.completed).length;
  const progressPercentage = (completedLessons / course.lessons.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Lesson sidebar */}
      <Card className="w-full lg:w-64 h-fit">
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <div className="mt-4">
            <Progress value={progressPercentage} />
            <p className="mt-2 text-sm text-gray-500">
              {completedLessons} of {course.lessons.length} lessons completed
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {course.lessons.map((lesson) => {
              const isCompleted = progress.some(
                p => p.lesson_id === lesson.id && p.completed
              );
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-2 rounded transition-colors
                    ${activeLesson.id === lesson.id
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center
                      ${activeLesson.id === lesson.id 
                        ? 'border-white' 
                        : 'border-gray-300'}`}
                    >
                      {isCompleted && (
                        <svg
                          className={`w-4 h-4 ${
                            activeLesson.id === lesson.id 
                              ? 'stroke-white' 
                              : 'stroke-gray-600'
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className={
                      activeLesson.id === lesson.id 
                        ? 'text-white' 
                        : 'text-gray-700'
                    }>
                      {lesson.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lesson content */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{activeLesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {activeLesson.content}
          </div>
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => {
                const currentIndex = course.lessons.findIndex(
                  l => l.id === activeLesson.id
                );
                if (currentIndex > 0) {
                  setActiveLesson(course.lessons[currentIndex - 1]);
                }
              }}
              className={`px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={
                course.lessons.findIndex(l => l.id === activeLesson.id) === 0
              }
            >
              Previous Lesson
            </button>
            <button
              onClick={() => {
                onLessonComplete(activeLesson.id);
                const currentIndex = course.lessons.findIndex(
                  l => l.id === activeLesson.id
                );
                if (currentIndex < course.lessons.length - 1) {
                  setActiveLesson(course.lessons[currentIndex + 1]);
                }
              }}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              {progress.some(p => p.lesson_id === activeLesson.id && p.completed)
                ? 'Next Lesson'
                : 'Complete & Continue'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}