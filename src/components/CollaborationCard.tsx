import React from 'react';

interface CollaborationCardProps {
  company: string;
  description: string;
  logo: string;
}

const CollaborationCard: React.FC<CollaborationCardProps> = ({
  company,
  description,
  logo
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-900 p-8 hover:bg-gray-800 transition-colors">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-lg overflow-hidden">
          <img
            src={logo}
            alt={company}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-2">{company}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CollaborationCard;