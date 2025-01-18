import React, { useEffect, useRef } from 'react';

const CursorEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
      cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;

      const target = e.target as HTMLElement;
      const isClickable = target.closest('a, button') !== null;
      
      cursor.style.width = isClickable ? '50px' : '30px';
      cursor.style.height = isClickable ? '50px' : '30px';
      cursor.style.borderColor = isClickable ? '#EC4899' : '#E91E63';
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-[30px] h-[30px] pointer-events-none z-50 border-2 border-pink-600 rounded-full transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={cursorDotRef}
        className="fixed w-1 h-1 pointer-events-none z-50 bg-pink-600 rounded-full transition-all duration-100 ease-out -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

export default CursorEffect;