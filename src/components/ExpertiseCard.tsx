import React, { useState } from 'react';

interface ExpertiseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  title,
  description,
  icon,
  details
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative p-6 bg-gray-900 rounded-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-pink-600/10 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center mb-4">
        <div className="text-pink-600 mr-3 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-pink-600">{title}</h3>
      </div>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className={`space-y-2 transition-all duration-300 ${
        isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
      } overflow-hidden`}>
        {details.map((detail, index) => (
          <div key={index} className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-600 mr-2"></div>
            <span className="text-sm text-gray-300">{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertiseCard;