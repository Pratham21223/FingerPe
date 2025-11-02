import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import * as GiIcons from 'react-icons/gi';
import * as MdIcons from 'react-icons/md';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io5';

const RecentMerchants = ({ merchants }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-grotesk text-2xl font-bold text-white">
          Recent Merchants
        </h2>
        
        {/* Navigation Arrows on Right */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="liquid-button w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10"
          >
            <FiChevronLeft className="text-white/80" size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="liquid-button w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10"
          >
            <FiChevronRight className="text-white/80" size={20} />
          </motion.button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
      >
        {merchants.map((merchant, index) => {
          const IconComponent = getIcon(merchant.icon);
          
          return (
            <motion.button
              key={merchant.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.6 + index * 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 flex-shrink-0 group"
            >
              <div className="w-20 h-20 rounded-2xl bg-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.12] transition-all duration-300 backdrop-blur-sm">
                <IconComponent 
                  className="text-white group-hover:text-accent-cyan transition-colors duration-300" 
                  size={32} 
                />
              </div>
              
              <div className="text-center">
                <p className="font-grotesk text-sm text-white/90 font-medium">
                  {merchant.name}
                </p>
                <p className="font-rajdhani text-xs text-white/40 mt-0.5">
                  ₹{merchant.lastAmount}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentMerchants;

