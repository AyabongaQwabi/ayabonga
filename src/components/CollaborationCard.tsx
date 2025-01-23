import type React from 'react';

interface CollaborationCardProps {
  company: string;
  description: string;
  logo: string;
  url: string;
}

const CollaborationCard: React.FC<CollaborationCardProps> = ({
  company,
  description,
  logo,
  url,
}) => {
  return (
    <a
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='block hover:scale-105 transition-transform w-full'
    >
      <div className='relative overflow-hidden rounded-lg bg-gray-900 p-8 hover:bg-gray-800 transition-colors'>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='w-32 h-32 rounded-full overflow-hidden bg-white bg-opacity-5 p-6 flex items-center justify-center flex-shrink-0'>
            <img
              src={logo || '/placeholder.svg'}
              alt={company}
              className='w-full h-full object-contain'
            />
          </div>
          <div className='flex-grow'>
            <h3 className='text-2xl font-bold mb-2 text-center md:text-left'>
              {company}
            </h3>
            <p className='text-gray-300'>{description}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default CollaborationCard;
