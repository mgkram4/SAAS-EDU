// types/course.ts
export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url?: string;
    price: number;
    lessons: Lesson[];
  }
  
  export interface Lesson {
    id: string;
    title: string;
    content: string;
    course_id: string;
  }
  
  export interface Progress {
    id: string;
    user_id: string;
    lesson_id: string;
    completed: boolean;
    created_at: string;
  }
  
  export interface Enrollment {
    id: string;
    user_id: string;
    course_id: string;
    status: 'active' | 'completed' | 'cancelled';
    created_at: string;
  }
  