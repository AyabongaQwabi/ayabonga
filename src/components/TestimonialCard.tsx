import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Quote } from 'lucide-react';

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

export function TestimonialCard({
  content,
  author,
  role,
  company,
  image,
}: TestimonialProps) {
  return (
    <Card className='relative overflow-hidden border-none bg-gradient-to-b from-gray-900 to-gray-800'>
      <CardContent className='p-6'>
        <Quote className='absolute top-6 right-6 h-12 w-12 text-pink-600/20' />
        <div className='space-y-4'>
          <p className='text-lg text-gray-300 leading-relaxed'>"{content}"</p>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-12 w-12'>
              <AvatarImage src={image} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className='text-xl font-bold text-white'>{author}</p>
              <p className='text-sm text-gray-400'>
                {role} at {company}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
