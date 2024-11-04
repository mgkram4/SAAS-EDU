import Navbar from '@/components/layout/Navbar';
import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'Platform Name - Online Learning Platform',
  description: 'Master new skills with expert-led online courses. Join thousands of learners advancing their careers through our comprehensive online learning platform.',
  keywords: 'online courses, learning platform, education, skills development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
  
      <body>
      <Navbar/>{children}</body>
    </html>
  )
}