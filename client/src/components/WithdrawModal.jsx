import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { useState } from 'react';
import PaymentMethodCard from './PaymentMethodCard';
import clsx from 'clsx';

const WithdrawModal = ({ isOpen, onClose, withdrawMethods, availableBalance, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleWithdraw = () => {
    if (!amount || !selectedMethod) return;
    
    const numAmount = parseFloat(amount);
    if (numAmount < 100) {
      onSuccess(false, 'Minimum withdrawal amount is ₹100');
      return;
    }
    
    if (numAmount > availableBalance) {
      onSuccess(false, 'Insufficient balance for withdrawal');
      return;
    }

    setShowConfirmation(true);
  };

  const confirmWithdrawal = () => {
    setIsProcessing(true);
    setShowConfirmation(false);
    
    const numAmount = parseFloat(amount);
    
    // Simulate withdrawal processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(true, `Withdrawal of ₹${numAmount.toLocaleString('en-IN')} initiated successfully!`, numAmount);
      onClose();
      setAmount('');
      setSelectedMethod(null);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[999]"
            onClick={() => {
              if (!showConfirmation) onClose();
            }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          >
            <div className="liquid-glass rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="font-space font-bold text-2xl text-white">
                  Withdraw Money
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full liquid-button flex items-center justify-center hover:bg-white/10"
                >
                  <FiX className="text-white text-xl" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="font-rajdhani text-white/60 text-sm mb-2 block">
                    Enter Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-orbitron text-2xl text-white/40">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full liquid-glass rounded-3xl px-5 pl-12 py-5 font-orbitron text-3xl text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-electric-blue transition-all"
                    />
                  </div>
                  <p className="font-rajdhani text-white/60 text-xs mt-2 ml-1">
                    Available: ₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Withdrawal Methods */}
                <div>
                  <label className="font-rajdhani text-white/60 text-sm mb-4 block">
                    Select Withdrawal Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {withdrawMethods.map((method, index) => (
                      <PaymentMethodCard
                        key={method.id}
                        method={method}
                        isSelected={selectedMethod?.id === method.id}
                        onClick={() => setSelectedMethod(method)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: selectedMethod && amount ? 1.02 : 1 }}
                  whileTap={{ scale: selectedMethod && amount ? 0.98 : 1 }}
                  onClick={handleWithdraw}
                  disabled={!selectedMethod || !amount || isProcessing}
                  className={clsx(
                    'w-full rounded-3xl py-5 font-space font-bold text-lg transition-all',
                    selectedMethod && amount && !isProcessing
                      ? 'bg-gradient-to-r from-electric-blue to-purple-500 text-white pulse-animation'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  )}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Processing...
                    </span>
                  ) : (
                    'Withdraw'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirmation && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
              >
                <div className="liquid-glass rounded-[32px] p-8 max-w-md w-full">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <FiAlertCircle className="text-yellow-500 text-3xl" />
                    </div>
                  </div>
                  <h3 className="font-space font-bold text-xl text-white text-center mb-2">
                    Confirm Withdrawal
                  </h3>
                  <p className="font-rajdhani text-white/60 text-center mb-6">
                    Are you sure you want to withdraw ₹{parseFloat(amount).toLocaleString('en-IN')} to {selectedMethod?.name}?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="flex-1 liquid-button rounded-2xl py-4 font-space font-semibold text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmWithdrawal}
                      className="flex-1 bg-gradient-to-r from-electric-blue to-purple-500 rounded-2xl py-4 font-space font-semibold text-white"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default WithdrawModal;
