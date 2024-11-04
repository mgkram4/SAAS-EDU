
// components/courses/CourseFilters.tsx
'use client';

import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function CourseFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = debounce((term: string) => {
    router.push(pathname + '?' + createQueryString('search', term));
  }, 300);

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + '?' + createQueryString(name, value));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
      <div className="relative flex-1 max-w-lg">
        <input
          type="text"
          placeholder="Search courses..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
      
      <div className="flex gap-2">
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={searchParams.get('category') || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="development">Development</option>
          <option value="business">Business</option>
          <option value="design">Design</option>
        </select>

        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          value={searchParams.get('sort') || 'latest'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="latest">Sort by: Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
}
