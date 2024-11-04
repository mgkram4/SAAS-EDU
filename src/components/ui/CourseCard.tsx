"use client"

import { Award, Book, ChevronRight, Clock, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

// Base course data received as props
interface Course {
  title: string;
  description: string;
  price: number;
}

// Extended course details used internally
interface CourseDetails extends Course {
  id: number;
  fullDescription: string;
  duration: string;
  lessons: string;
  level: string;
  topics: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const demoData: CourseDetails = {
    id: 1,
    title: course.title,
    description: course.description,
    price: course.price,
    fullDescription: "This comprehensive course covers everything you need to know. You'll learn through hands-on projects and real-world examples.",
    duration: "12 weeks",
    lessons: "24 lessons",
    level: "All levels",
    topics: [
      "Introduction to Programming",
      "Data Structures",
      "Object-Oriented Programming",
      "Advanced Concepts",
      "Projects and Practice"
    ]
  };

  return (
    <>
      {/* Card */}
      <div 
        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <div className="aspect-video relative bg-gray-100">
          <img
            src="/api/placeholder/400/225"
            alt={demoData.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{demoData.title}</h3>
          <p className="text-gray-600 line-clamp-2 mb-4">
            {demoData.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">${demoData.price}</span>
            <div className="flex items-center text-blue-600">
              Learn more <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-6">
          {/* Header */}
          <h2 className="text-2xl font-bold mb-6">{demoData.title}</h2>
          
          {/* Course Overview */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Course Overview</h3>
            <p className="text-gray-600">{demoData.fullDescription}</p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>{demoData.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-blue-600" />
              <span>{demoData.lessons}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>{demoData.level}</span>
            </div>
          </div>

          {/* Course Topics */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">What Youll Learn</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {demoData.topics.map((topic, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price and CTA */}
          <div className="flex justify-between items-center pt-4 border-t mt-6">
            <div>
              <span className="text-sm text-gray-600">Course Price</span>
              <p className="text-3xl font-bold">${demoData.price}</p>
            </div>
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                // Add enrollment logic here
              }}
            >
              Enroll Now
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CourseCard;