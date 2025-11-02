import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';

const PaymentSuccess = ({ isOpen, onClose, paymentData }) => {
  console.log('🎊 PaymentSuccess modal opened with data:', paymentData);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <motion.div
              className="liquid-glass rounded-[40px] p-8 max-w-sm w-full text-center"
            >
              {/* Success Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                  delay: 0.2
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400/40 to-emerald-500/20 flex items-center justify-center mx-auto mb-6 border-2 border-green-400/50"
                style={{
                  boxShadow: '0 0 40px rgba(34, 197, 94, 0.5)'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <FiCheck size={48} className="text-green-400" strokeWidth={2} />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-grotesk text-3xl font-bold text-white mb-2"
              >
                Transfer Sent!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-rajdhani text-sm text-white/50 mb-6"
              >
                Money transferred successfully
              </motion.p>

              {/* Transfer Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4 mb-8"
              >
                {/* Recipient */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <p className="font-rajdhani text-xs text-white/50 uppercase tracking-wider mb-2">
                    Transferred To
                  </p>
                  <p className="font-grotesk text-lg font-bold text-white">
                    {paymentData?.name || 'Unknown'}
                  </p>
                </div>

                {/* Amount */}
                <div className="bg-gradient-to-r from-green-400/10 to-emerald-500/10 rounded-2xl p-4 border border-green-400/20">
                  <p className="font-rajdhani text-xs text-green-400/60 uppercase tracking-wider mb-2">
                    Amount Transferred
                  </p>
                  <p className="font-orbitron text-3xl font-bold text-green-400">
                    ₹{paymentData?.amount ? parseFloat(paymentData.amount).toLocaleString('en-IN') : '0'}
                  </p>
                </div>

                {/* Phone Number */}
                {paymentData?.phoneNumber && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="font-rajdhani text-xs text-white/50 uppercase tracking-wider mb-2">
                      Phone Number
                    </p>
                    <p className="font-rajdhani text-sm text-accent-cyan">
                      {paymentData.phoneNumber}
                    </p>
                  </div>
                )}

                {/* Transaction ID */}
                {paymentData?.transactionId && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="font-rajdhani text-xs text-white/50 uppercase tracking-wider mb-2">
                      Transaction ID
                    </p>
                    <p className="font-orbitron text-xs text-accent-cyan font-mono break-all">
                      {paymentData.transactionId}
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full liquid-button rounded-2xl py-3 font-grotesk font-medium text-white hover:bg-white/10 transition-all"
              >
                Done
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="font-rajdhani text-xs text-white/30 mt-4"
              >
                Secured with end-to-end encryption
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentSuccess;

