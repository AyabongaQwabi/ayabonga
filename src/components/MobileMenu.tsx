'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface MobileMenuProps {
  scrollToSection: (id: string) => void;
}

export function MobileMenu({ scrollToSection }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='default' size='icon' className='md:hidden text-4xl'>
          <Menu className='h-20 w-20 text-4xl' />
          <span className='sr-only h-96 w-96'>Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-[300px] sm:w-[400px] bg-pink-700 text-white text-2xl'
      >
        <nav className='flex flex-col gap-4'>
          <Button
            variant='ghost'
            onClick={() => handleNavClick('about')}
            className='text-2xl'
          >
            About
          </Button>
          <Button
            variant='ghost'
            onClick={() => handleNavClick('expertise')}
            className='text-2xl'
          >
            Expertise
          </Button>
          <Button
            variant='ghost'
            onClick={() => handleNavClick('projects')}
            className='text-2xl'
          >
            Projects
          </Button>
          <Button
            variant='ghost'
            onClick={() => handleNavClick('collaborations')}
            className='text-2xl'
          >
            Collaborations
          </Button>
          <Button
            variant='ghost'
            onClick={() => handleNavClick('contact')}
            className='text-2xl'
          >
            Contact
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
