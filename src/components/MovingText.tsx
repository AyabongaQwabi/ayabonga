import type React from 'react';
import { useState, useEffect } from 'react';

interface MovingTextProps {
  texts: string[];
}

const MovingText: React.FC<MovingTextProps> = ({ texts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <h1
      className={`text-5xl md:text-7xl font-bold mb-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {texts[currentIndex]}
    </h1>
  );
};

export default MovingText;
