import React from 'react';
import { motion } from 'framer-motion';

interface SectionButtonProps {
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
}

const SectionButtonWidget: React.FC<SectionButtonProps> = ({ 
  name, 
  icon, 
  isActive, 
  onClick,
  badgeCount 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group
        px-4 py-2.5
        flex items-center gap-3
        transition-all duration-300
        hover:bg-gray-100 rounded-lg
        ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}
      `}
    >
      {/* Icon wrapper */}
      <div className={`
        transition-transform duration-300
        group-hover:scale-110
        ${isActive ? 'text-blue-600' : 'text-gray-500'}
      `}>
        {icon}
      </div>

      {/* Text */}
      <span className={`
        text-sm font-medium
        transition-colors duration-300
        ${isActive ? 'text-gray-900' : 'text-gray-600'}
      `}>
        {name}
      </span>

      {/* Badge (optional) */}
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="
          min-w-[20px] h-5
          flex items-center justify-center
          text-xs font-medium
          bg-blue-100 text-blue-700
          rounded-full px-1.5
        ">
          {badgeCount}
        </span>
      )}

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeSection"
          className="
            absolute bottom-0 left-0
            w-full h-0.5
            bg-blue-600
          "
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
};

export default SectionButtonWidget