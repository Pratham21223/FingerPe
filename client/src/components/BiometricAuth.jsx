import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { MdFingerprint } from 'react-icons/md';

const BiometricAuth = ({ isOpen, onClose, onSuccess, paymentData }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleFingerprintClick = async () => {
    setIsScanning(true);

    // Simulate scanning
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('✅ Payment Verified');
    setIsScanning(false);
    setTimeout(() => {
      onSuccess?.();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-lg"
          />

          <motion.div
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100vh', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[10000] max-w-md mx-auto"
          >
            <motion.div
              className="liquid-glass rounded-t-[40px] p-8 pb-12"
              style={{
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
              }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 liquid-button w-10 h-10 rounded-full flex items-center justify-center"
              >
                <FiX className="text-white/70" size={20} />
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="font-grotesk text-2xl font-bold text-white mb-2">
                  Verify Payment
                </h2>
                <p className="font-rajdhani text-sm text-white/50">
                  Touch fingerprint to confirm
                </p>
              </motion.div>

              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 rounded-2xl p-4 mb-8 border border-accent-cyan/20"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-rajdhani text-xs text-white/50 uppercase tracking-wider mb-1">
                      Paying To
                    </p>
                    <p className="font-grotesk text-lg font-bold text-white">
                      {paymentData?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-rajdhani text-xs text-white/50 uppercase tracking-wider mb-1">
                      Amount
                    </p>
                    <p className="font-orbitron text-xl font-bold text-accent-cyan">
                      ₹{parseFloat(paymentData?.amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Fingerprint Button */}
              <div className="flex justify-center mb-8">
                <motion.button
                  whileHover={!isScanning ? { scale: 1.05 } : {}}
                  whileTap={!isScanning ? { scale: 0.95 } : {}}
                  onClick={handleFingerprintClick}
                  disabled={isScanning}
                  animate={{
                    scale: isScanning ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    scale: {
                      repeat: isScanning ? Infinity : 0,
                      duration: 1.5,
                      ease: "easeInOut"
                    }
                  }}
                  className="w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer relative group bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 border-2 border-accent-cyan/50 hover:border-accent-cyan hover:bg-gradient-to-br hover:from-accent-cyan/30 hover:to-accent-blue/30 disabled:opacity-50"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)'
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: isScanning ? 360 : 0
                    }}
                    transition={{
                      rotate: {
                        repeat: isScanning ? Infinity : 0,
                        duration: 2,
                        ease: "linear"
                      }
                    }}
                  >
                    <MdFingerprint size={48} className="text-accent-cyan group-hover:text-accent-blue transition-colors" />
                  </motion.div>

                  {/* Pulse effect */}
                  {!isScanning && (
                    <motion.div
                      animate={{
                        boxShadow: [
                          'inset 0 0 0 0 rgba(0, 212, 255, 0.6)',
                          'inset 0 0 0 8px rgba(0, 212, 255, 0)'
                        ]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeOut"
                      }}
                      className="absolute inset-0 rounded-full"
                    />
                  )}
                </motion.button>
              </div>

              {/* Status Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center font-rajdhani text-sm text-white/70"
              >
                {isScanning ? 'Verifying...' : 'Tap to verify'}
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BiometricAuth;

