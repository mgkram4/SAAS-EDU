'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleEnroll = async () => {
    try {
      setLoading(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
        return;
      }

      // Create enrollment record
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: session.user.id,
          course_id: courseId,
          status: 'active'
        });

      if (error) throw error;

      // Refresh the page to show course content
      router.refresh();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium disabled:opacity-50"
    >
      {loading ? 'Enrolling...' : 'Enroll Now'}
    </button>
  );
}