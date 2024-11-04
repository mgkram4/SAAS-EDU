// app/dashboard/page.tsx
"use client"

import { Award, Book, ChevronRight, Clock, GraduationCap, LineChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  price: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  course_id: string;
}

interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  created_at: string;
}

interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

interface EnrolledCourseWithProgress extends Course {
  enrollment: Enrollment;
  progress: {
    completedLessons: number;
    totalLessons: number;
    percentage: number;
    lastActivityDate: string;
  };
}

interface CompletedLessonActivity {
  progress: Progress;
  lesson: Lesson;
  course: Course;
}

interface UserStats {
  totalCourses: number;
  completedLessons: number;
  totalTimeSpent: number;
  averageProgress: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseWithProgress[]>([]);
  const [recentActivity, setRecentActivity] = useState<CompletedLessonActivity[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalCourses: 0,
    completedLessons: 0,
    totalTimeSpent: 0,
    averageProgress: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockEnrolledCourses: EnrolledCourseWithProgress[] = [
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Learn the basics of React',
        thumbnail_url: '/api/placeholder/400/225',
        price: 99,
        lessons: [
          { id: '1', title: 'Introduction', content: 'Welcome to React', course_id: '1' },
          { id: '2', title: 'Components', content: 'Building blocks', course_id: '1' },
        ],
        enrollment: {
          id: '1',
          user_id: 'user1',
          course_id: '1',
          status: 'active',
          created_at: new Date().toISOString(),
        },
        progress: {
          completedLessons: 3,
          totalLessons: 10,
          percentage: 30,
          lastActivityDate: new Date().toISOString(),
        }
      },
      // Add more mock courses here
    ];

    setEnrolledCourses(mockEnrolledCourses);
    
    setStats({
      totalCourses: mockEnrolledCourses.length,
      completedLessons: mockEnrolledCourses.reduce(
        (acc, course) => acc + course.progress.completedLessons, 
        0
      ),
      totalTimeSpent: 1840,
      averageProgress: mockEnrolledCourses.reduce(
        (acc, course) => acc + course.progress.percentage, 
        0
      ) / Math.max(mockEnrolledCourses.length, 1),
    });
  }, []);

  const handleContinueCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };

  const formatTimeSpent = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <Book className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Completed Lessons</p>
              <p className="text-2xl font-bold">{stats.completedLessons}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Time Spent Learning</p>
              <p className="text-2xl font-bold">{formatTimeSpent(stats.totalTimeSpent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <LineChart className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Average Progress</p>
              <p className="text-2xl font-bold">{Math.round(stats.averageProgress)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
          <div className="space-y-4">
            {enrolledCourses.map(course => (
              <div 
                key={course.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex">
                  <div className="w-48 h-32 flex-shrink-0">
                    <img
                      src={course.thumbnail_url || '/api/placeholder/400/225'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <span className={`text-sm px-2 py-1 rounded ${
                        course.enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        course.enrollment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {course.enrollment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{course.lessons.length} lessons</span>
                      <span>•</span>
                      <span>Last activity: {formatDate(course.progress.lastActivityDate)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${course.progress.percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {course.progress.completedLessons} of {course.progress.totalLessons} lessons complete
                      </span>
                      <button 
                        onClick={() => handleContinueCourse(course.id)}
                        className="text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                      >
                        Continue <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.progress.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.lesson.title}</p>
                    <p className="text-sm text-gray-600">{activity.course.title}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.progress.created_at)}
                    </p>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No recent activity to show
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}