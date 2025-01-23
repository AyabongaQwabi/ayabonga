import { Card, CardContent, CardHeader } from './ui/card';
import { cn } from '../lib/utils';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  description,
  className,
  icon,
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        'group relative p-6 bg-gray-900 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-pink-600/10 cursor-pointer',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex items-center mb-4'>
        {icon && (
          <div className='text-pink-600 mr-3 transition-transform group-hover:scale-110'>
            {icon}
          </div>
        )}
        <h3 className='text-xl font-bold text-pink-600'>{title}</h3>
      </div>
      <div className='text-3xl font-bold mb-2 text-white'>{value}</div>
      <p className='text-gray-300'>{description}</p>
      <div
        className={`space-y-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
        } overflow-hidden`}
      >
        <div className='h-1 w-full bg-pink-600/20 rounded mt-4'></div>
      </div>
    </Card>
  );
}
