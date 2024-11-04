// src/components/ui/CourseCard.tsx

import { Course } from '@/types/course';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <div className="aspect-video relative">
          <Image
            src={course.thumbnail_url || '/api/placeholder/400/225'}
            alt={course.title}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 line-clamp-2">
            {course.description}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <span className="font-bold">${course.price}</span>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full">
              Enroll Now
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}