import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io5';

const ServiceCard = ({ service, index }) => {
  const getIcon = (iconName) => {
    return (
      FiIcons[iconName] || 
      GiIcons[iconName] || 
      MdIcons[iconName] || 
      FaIcons[iconName] || 
      IoIcons[iconName] || 
      FiIcons.FiCircle
    );
  };

  const IconComponent = getIcon(service.icon);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.02,
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center justify-center gap-2.5 cursor-pointer group"
    >
      {/* Icon Container - Smaller */}
      <div className="w-16 h-16 rounded-xl bg-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm">
        <IconComponent 
          className="text-white group-hover:text-accent-cyan transition-colors duration-300" 
          size={28} 
        />
      </div>
      
      {/* Label - Smaller */}
      <span className="font-grotesk text-xs text-white/90 text-center font-medium leading-tight max-w-[80px] group-hover:text-white transition-colors duration-300">
        {service.name}
      </span>
    </motion.button>
  );
};

export default ServiceCard;
