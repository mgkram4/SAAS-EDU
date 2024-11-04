'use client';

import CourseCard from '@/components/ui/CourseCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BookOpen } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  price: number;
  category?: string;
  published: boolean;
  created_at: string;
}

export default function CourseGrid({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchCourses() {
      let query = supabase
        .from('courses')
        .select()
        .eq('published', true);

      // Apply search filter
      const searchTerm = searchParams.get('search');
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      // Apply category filter
      const category = searchParams.get('category');
      if (category) {
        query = query.eq('category', category);
      }

      // Apply sorting
      const sort = searchParams.get('sort');
      switch (sort) {
        case 'price_asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popular':
          query = query.order('enrollment_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data } = await query;
      if (data) {
        setCourses(data);
      }
    }

    fetchCourses();
  }, [searchParams, supabase]);

  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Found</h3>
        <p className="text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}