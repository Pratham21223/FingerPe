import { motion } from 'framer-motion';
import clsx from 'clsx';

const FilterTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'credit', label: 'Credit' },
    { id: 'debit', label: 'Debit' },
  ];

  return (
    <div className="flex gap-3 mb-6">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            'relative px-6 py-3 rounded-full font-space font-medium text-sm transition-all',
            activeTab === tab.id
              ? 'text-black'
              : 'text-white/60 hover:text-white'
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-electric-blue rounded-full"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default FilterTabs;
