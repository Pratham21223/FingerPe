import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import clsx from 'clsx';

const PaymentMethodCard = ({ method, isSelected, onClick, index }) => {
  // Dynamically get icon component
  const getIcon = (iconName) => {
    if (iconName.startsWith('Fi')) return FiIcons[iconName];
    if (iconName.startsWith('Fa')) return FaIcons[iconName];
    if (iconName.startsWith('Si')) return SiIcons[iconName];
    return FiIcons.FiCircle;
  };

  const IconComponent = getIcon(method.icon);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        'liquid-button rounded-3xl p-5 text-left w-full transition-all duration-300',
        isSelected && 'ring-2 ring-neon-cyan glow-cyan'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx(
          'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors',
          isSelected ? 'bg-neon-cyan/20' : 'bg-white/5'
        )}>
          <IconComponent className={clsx(
            'text-2xl',
            isSelected ? 'text-neon-cyan' : 'text-white/60'
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-space font-semibold text-white text-base mb-1">
            {method.name}
          </h3>
          <p className="font-rajdhani text-white/40 text-xs mb-2">
            {method.subtitle}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-rajdhani text-white/60 text-xs">
              Fee: {method.fee}
            </span>
            {method.time && (
              <>
                <span className="text-white/30">•</span>
                <span className="font-rajdhani text-white/60 text-xs">
                  {method.time}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default PaymentMethodCard;
