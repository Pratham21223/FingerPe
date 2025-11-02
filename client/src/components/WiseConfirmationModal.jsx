import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiTrendingDown } from 'react-icons/fi';

const WiseConfirmationModal = ({ isOpen, quote, onConfirm, onCancel }) => {
  if (!quote) return null;

  const fee = (quote.targetAmount * 0.015).toFixed(2);
  const finalAmount = (quote.targetAmount - fee).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[9998]"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="liquid-glass rounded-[40px] w-full max-w-md p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                  <FiTrendingDown className="text-neon-cyan text-2xl" />
                </div>
                <h2 className="font-space font-bold text-2xl text-white">
                  Confirm Exchange
                </h2>
              </div>

              {/* Exchange Details */}
              <div className="space-y-4 mb-8">
                {/* You Pay */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <p className="font-rajdhani text-white/60 text-sm mb-1">
                    You pay
                  </p>
                  <p className="font-orbitron font-bold text-2xl text-white">
                    ₹{quote.sourceAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="font-rajdhani text-white/40 text-xs">
                    Indian Rupees
                  </p>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center"
                >
                  <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                    <FiTrendingDown className="text-neon-cyan rotate-90" />
                  </div>
                </motion.div>

                {/* They Get */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <p className="font-rajdhani text-white/60 text-sm mb-1">
                    They receive
                  </p>
                  <p className="font-orbitron font-bold text-2xl text-electric-blue">
                    ${quote.targetAmount.toFixed(2)}
                  </p>
                  <p className="font-rajdhani text-white/40 text-xs">
                    US Dollars
                  </p>
                </motion.div>
              </div>

              {/* Exchange Rate & Fee */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div>
                  <p className="font-rajdhani text-white/60 text-xs mb-1">
                    Exchange Rate
                  </p>
                  <p className="font-orbitron font-bold text-white">
                    1 USD
                  </p>
                  <p className="font-rajdhani text-neon-cyan text-sm">
                    ₹{(quote.sourceAmount / quote.targetAmount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="font-rajdhani text-white/60 text-xs mb-1">
                    Wise Fee
                  </p>
                  <p className="font-orbitron font-bold text-white">
                    ${fee}
                  </p>
                  <p className="font-rajdhani text-white/40 text-xs">
                    ~1.5% fee
                  </p>
                </div>
              </motion.div>

              {/* Warning */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-8"
              >
                <p className="font-rajdhani text-yellow-300 text-sm">
                  ⏱️ This quote expires in 30 minutes. Confirm now to proceed.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-4"
              >
                <button
                  onClick={onCancel}
                  className="flex-1 liquid-button rounded-2xl px-6 py-4 font-space font-semibold text-white hover:bg-white/10 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiX />
                    Cancel
                  </span>
                </button>

                <button
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-neon-cyan to-electric-blue rounded-2xl px-6 py-4 font-space font-bold text-black hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiCheck />
                    Confirm
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WiseConfirmationModal;
