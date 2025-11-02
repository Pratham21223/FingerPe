import { motion } from 'framer-motion';
import { FiAward, FiArrowRight } from 'react-icons/fi';

const RewardsSection = ({ rewards }) => {
  const progress = (rewards.points / rewards.nextTier) * 100;
  const pointsToNext = rewards.nextTier - rewards.points;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass rounded-3xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="liquid-button w-14 h-14 rounded-2xl flex items-center justify-center">
            <FiAward className="text-yellow-400" size={26} />
          </div>
          <div>
            <h3 className="font-grotesk text-lg font-semibold text-white mb-0.5">
              {rewards.points.toLocaleString()} Points
            </h3>
            <p className="font-rajdhani text-xs text-white/40 uppercase tracking-wider">
              {rewards.currentTier} Tier
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, x: 3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 text-accent-cyan text-sm font-grotesk font-medium"
        >
          View
          <FiArrowRight size={16} />
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-rajdhani text-white/50 uppercase tracking-wide">
          <span>{rewards.currentTier}</span>
          <span>{pointsToNext} to {rewards.tierName}</span>
        </div>
        
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="h-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-300 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RewardsSection;

