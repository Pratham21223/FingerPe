import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight } from 'react-icons/fi';

const UPIPaymentConfirm = ({ isOpen, onClose, upiName, upiCode, onConfirm, paymentData }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update amount when paymentData changes
  useEffect(() => {
    if (paymentData?.amount) {
      setAmount(paymentData.amount.toString());
    }
  }, [paymentData]);

  const getPhoneNumber = () => {
    return paymentData?.phoneNumber || (upiCode?.match(/pa=([^&]+)/) || [])[1] || 'N/A';
  };

  const handleProceed = async () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      console.log('=== PAYMENT CONFIRMED ===');
      console.log('Name:', paymentData?.name || upiName);
      console.log('Phone:', getPhoneNumber());
      console.log('Amount:', amount);
      
      setTimeout(() => {
        onConfirm?.({ 
          name: paymentData?.name || upiName,
          phoneNumber: getPhoneNumber(),
          amount: parseInt(amount)
        });
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    setAmount('');
    setIsProcessing(false);
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9997] bg-black/60 backdrop-blur-xl"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="absolute -top-6 right-0 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white/70 hover:text-accent-cyan transition-colors"
              >
                <FiX size={24} />
              </motion.button>

              <motion.div
                className="liquid-glass rounded-[40px] p-8 overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-8"
                >
                  <h2 className="font-grotesk text-2xl font-bold text-white mb-2">
                    Confirm Payment
                  </h2>
                  <p className="font-rajdhani text-sm text-white/50">
                    UPI Verified & Ready
                  </p>
                </motion.div>

                {/* Recipient Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="liquid-button rounded-2xl p-4 mb-6 border-l-2 border-accent-cyan/50"
                >
                  <p className="font-rajdhani text-xs text-white/50 uppercase tracking-wider mb-2">
                    Paying To
                  </p>
                  <p className="font-grotesk text-lg font-bold text-white mb-3">
                    {paymentData?.name || upiName}
                  </p>
                  <p className="font-rajdhani text-sm text-accent-cyan">
                     {getPhoneNumber()}
                  </p>
                </motion.div>

                {/* Amount Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6"
                >
                  <label className="font-rajdhani text-xs text-white/50 uppercase tracking-wider block mb-3">
                    Amount
                  </label>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-orbitron text-xl text-accent-cyan font-bold">
                      ₹
                    </div>
                    <input
                      type="number"
                      value={paymentData?.amount || amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0"
                      disabled={isProcessing || isSuccess}
                      className="w-full liquid-button rounded-2xl py-4 pl-10 pr-4 text-white font-orbitron text-xl bg-white/5 border border-accent-cyan/20 focus:border-accent-cyan/50 focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Amount suggestions */}
                  <div className="flex gap-2 mt-4">
                    {[100, 500, 1000, 5000].map((val) => (
                      <motion.button
                        key={val}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAmount(val.toString())}
                        disabled={isProcessing || isSuccess}
                        className="flex-1 liquid-button rounded-lg py-2 px-3 text-xs font-rajdhani text-white/70 hover:text-accent-cyan hover:bg-accent-cyan/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ₹{val}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Amount Display */}
                {amount && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-accent-cyan/10 to-accent-blue/10 rounded-2xl p-4 mb-6 border border-accent-cyan/20"
                  >
                    <p className="font-rajdhani text-xs text-white/50 uppercase tracking-wider mb-1">
                      Total Payment
                    </p>
                    <motion.p
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="font-orbitron text-3xl font-bold text-accent-cyan"
                    >
                      ₹{parseFloat(amount).toLocaleString('en-IN')}
                    </motion.p>
                  </motion.div>
                )}

                {/* Proceed Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleProceed}
                  disabled={isProcessing || isSuccess || !amount}
                  className="w-full liquid-button rounded-2xl py-4 font-grotesk font-bold text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-5 h-5 border-2 border-accent-cyan border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <span>Confirmed!</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <FiArrowRight size={20} />
                      </motion.div>
                    </>
                  )}

                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan/20 to-accent-cyan/0 -z-10"
                  />
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-rajdhani text-xs text-white/40 text-center mt-4"
                >
                  Secured with military-grade encryption
                </motion.p>
              </motion.div>

              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan rounded-[40px] blur-2xl -z-10"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UPIPaymentConfirm;
