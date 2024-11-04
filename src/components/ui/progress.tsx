// src/components/ui/Progress.tsx
export function Progress({ 
    value = 0,
    className = ""
  }: { 
    value: number;
    className?: string;
  }) {
    return (
      <div className={`h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  }