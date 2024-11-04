// src/lib/supabase.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getFeaturedCourses() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ 
      cookies: () => cookieStore 
    })
    
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
      .limit(3)
    
    if (error) {
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error details:', error)
    return []
  }
}