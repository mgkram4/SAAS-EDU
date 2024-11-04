// src/components/layout/Navbar.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-primary/10' : '';
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center font-bold text-xl">
              EduSaaS
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/course"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/courses')}`}
              >
                Browse Courses
              </Link>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/dashboard')}`}
              >
                My Learning
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/profile">
              <UserCircle className="h-8 w-8" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

