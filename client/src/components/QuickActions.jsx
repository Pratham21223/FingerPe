import { motion } from 'framer-motion';
import { FiPlus, FiArrowUpRight } from 'react-icons/fi';

const QuickActions = ({ onAddMoney, onWithdraw }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAddMoney}
        className="liquid-button rounded-2xl px-6 py-6 flex flex-col items-center justify-center gap-3 hover:glow-cyan group"
      >
        <div className="w-14 h-14 rounded-full bg-neon-cyan/10 flex items-center justify-center group-hover:bg-neon-cyan/20 transition-colors">
          <FiPlus className="text-neon-cyan text-2xl" />
        </div>
        <span className="font-space font-semibold text-white text-lg">
          Add Money
        </span>
      </motion.button>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onWithdraw}
        className="liquid-button rounded-2xl px-6 py-6 flex flex-col items-center justify-center gap-3 hover:glow-blue group"
      >
        <div className="w-14 h-14 rounded-full bg-electric-blue/10 flex items-center justify-center group-hover:bg-electric-blue/20 transition-colors">
          <FiArrowUpRight className="text-electric-blue text-2xl" />
        </div>
        <span className="font-space font-semibold text-white text-lg">
          Withdraw
        </span>
      </motion.button>
    </div>
  );
};

export default QuickActions;
