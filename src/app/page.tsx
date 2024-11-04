// src/app/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowRight, BookOpen, Trophy, Users } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  price: number;
}

async function getFeaturedCourses() {
  try {
    // Create Supabase client with proper cookie handling
    const cookieStore = cookies();
    const supabase = createServerComponentClient({
      cookies: () => cookieStore,
    });

    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        price
      `)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        hint: error.hint,
        details: error.details,
        code: error.code
      });
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LandingPage() {
  const featuredCourses = await getFeaturedCourses();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Master New Skills with Expert-Led Online Courses
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of learners advancing their careers through our 
              comprehensive online learning platform
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/courses"
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
              <Link 
                href="/auth/login"
                className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">100+</h3>
              <p className="text-gray-600">Expert-led courses</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">10,000+</h3>
              <p className="text-gray-600">Active learners</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Completion rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
            <p className="text-gray-600 mt-2">Start your learning journey today</p>
          </div>
          
          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                        <BookOpen className="w-12 h-12 text-blue-600/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">
                        ${course.price}
                      </span>
                      <Link 
                        href={`/courses/${course.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        Learn more
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <BookOpen className="w-12 h-12 text-blue-600/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                New Courses Coming Soon
              </h3>
              <p className="text-gray-500">
                We're working on bringing you amazing courses.
              </p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 justify-center"
            >
              View all courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-blue-100 mb-8">
              Join our community of learners and start your journey today.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}