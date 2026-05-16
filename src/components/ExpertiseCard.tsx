import type React from 'react';
import { useState } from 'react';
import GlassCard from './GlassCard';

type ExpertiseVariant = 'gold' | 'dark' | 'emerald';

interface ExpertiseCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
  variant?: ExpertiseVariant;
  accentColor?: string;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  title,
  description,
  icon,
  details = [],
  variant = 'dark',
  accentColor = 'text-primary',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GlassCard
      as="article"
      variant={variant}
      hover
      className="group border-white/5 hover:border-white/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${accentColor}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold mb-2 text-white`}>{title}</h3>
      <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
      {details.length > 0 && (
        <div
          className={`space-y-2 mt-4 transition-all duration-300 overflow-hidden ${
            isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
          }`}
        >
          {details.map((detail, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${accentColor.replace('text-', 'bg-')}`} />
              <span className="text-xs text-slate-300">{detail}</span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default ExpertiseCard;
