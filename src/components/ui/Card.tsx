// src/components/ui/Card.tsx
export function Card({ 
    children, 
    className = "" 
  }: { 
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardHeader({ 
    children,
    className = ""
  }: { 
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={`p-6 ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardTitle({ 
    children,
    className = ""
  }: { 
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
      </h3>
    );
  }
  
  export function CardContent({ 
    children,
    className = ""
  }: { 
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={`p-6 pt-0 ${className}`}>
        {children}
      </div>
    );
  }
  