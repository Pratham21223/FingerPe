import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import BalanceCard from './BalanceCard';
import QuickActions from './QuickActions';
import AddMoneyModal from './AddMoneyModal';
import WithdrawModal from './WithdrawModal';
import TransactionHistory from './TransactionHistory';
import Toast from './Toast';
import { walletManagementData } from '../utils/walletData';

const WalletManagementPage = () => {
  const [balance, setBalance] = useState(walletManagementData.balance.current);
  const [availableBalance, setAvailableBalance] = useState(walletManagementData.balance.availableForWithdrawal);
  const [transactions, setTransactions] = useState(walletManagementData.transactions);
  
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successType, setSuccessType] = useState('');

  // Debug: Log when add money button is clicked
  const handleAddMoneyClick = () => {
    console.log('Add Money clicked - Opening modal');
    setIsAddMoneyOpen(true);
  };

  // Debug: Log when modal closes
  const handleAddMoneyClose = () => {
    console.log('Closing Add Money modal');
    setIsAddMoneyOpen(false);
  };

  const handleAddMoneySuccess = (success, message, amount) => {
    if (success) {
      setSuccessType('add');
      setShowSuccessAnimation(true);
      
      setTimeout(() => {
        setBalance(prev => prev + amount);
        setAvailableBalance(prev => prev + amount);
        
        const newTransaction = {
          id: Date.now(),
          type: 'credit',
          method: 'Payment Gateway',
          amount: amount,
          date: new Date().toISOString(),
          status: 'success',
          description: 'Money added successfully'
        };
        setTransactions(prev => [newTransaction, ...prev]);
        
        setShowSuccessAnimation(false);
      }, 2000);
    }
    
    setToast({
      isVisible: true,
      message: message,
      type: success ? 'success' : 'error'
    });
  };

  const handleWithdrawSuccess = (success, message, amount) => {
    if (success) {
      setSuccessType('withdraw');
      setShowSuccessAnimation(true);
      
      setTimeout(() => {
        setBalance(prev => prev - amount);
        setAvailableBalance(prev => prev - amount);
        
        const newTransaction = {
          id: Date.now(),
          type: 'debit',
          method: 'Withdrawal',
          amount: amount,
          date: new Date().toISOString(),
          status: 'success',
          description: 'Withdrawal initiated'
        };
        setTransactions(prev => [newTransaction, ...prev]);
        
        setShowSuccessAnimation(false);
      }, 2000);
    }
    
    setToast({
      isVisible: true,
      message: message,
      type: success ? 'success' : 'error'
    });
  };

  // Debug: Log modal state
  console.log('Modal States:', { isAddMoneyOpen, isWithdrawOpen });

  return (
    <div className="min-h-screen bg-dark-gradient px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BalanceCard balance={balance} />
        
        <QuickActions 
          onAddMoney={handleAddMoneyClick}
          onWithdraw={() => setIsWithdrawOpen(true)}
        />

        <TransactionHistory transactions={transactions} />

        {/* Add Money Modal - Always rendered, controlled by isOpen */}
        <AddMoneyModal
          isOpen={isAddMoneyOpen}
          onClose={handleAddMoneyClose}
          paymentMethods={walletManagementData.paymentMethods.addMoney}
          onSuccess={handleAddMoneySuccess}
        />

        {/* Withdraw Modal */}
        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          withdrawMethods={walletManagementData.paymentMethods.withdraw}
          availableBalance={availableBalance}
          onSuccess={handleWithdrawSuccess}
        />

        {/* Toast */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />

        {/* Success Animation Overlay */}
        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[9999] flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    successType === 'add' ? 'bg-green-400/20 glow-green' : 'bg-blue-400/20 glow-blue'
                  }`}
                >
                  <FiCheck className={`text-6xl ${
                    successType === 'add' ? 'text-green-400' : 'text-blue-400'
                  }`} />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-space font-bold text-3xl text-white mb-2"
                >
                  {successType === 'add' ? 'Money Added Successfully!' : 'Withdrawal Initiated!'}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="font-rajdhani text-white/60 text-lg"
                >
                  {successType === 'add' 
                    ? 'Your wallet has been credited' 
                    : 'Your withdrawal is being processed'}
                </motion.p>
              </motion.div>

              {/* Confetti particles */}
              {successType === 'add' && (
                <>
                  {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 600,
                        y: (Math.random() - 0.5) * 600,
                        opacity: [1, 0],
                        scale: [1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: Math.random() * 0.3,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WalletManagementPage;

