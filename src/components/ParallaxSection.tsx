import React, { useEffect, useRef } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ children }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        sectionRef.current.style.transform = `translate3d(0, ${rate}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      {children}
    </div>
  );
};

export default ParallaxSection;