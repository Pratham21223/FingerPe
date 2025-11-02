import { motion } from 'framer-motion';
import { FiInbox } from 'react-icons/fi';
import FilterTabs from './FilterTabs';
import TransactionCard from './TransactionCard';
import { useState } from 'react';

const TransactionHistory = ({ transactions }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      className="mt-8"
    >
      <h2 className="font-space font-bold text-2xl text-white mb-6">
        Transaction History
      </h2>
      <div style={{display: "flex", justifyContent: "space-between"}}>
      <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <a style={{color: "rgb(3, 219, 235)"}} href="/summary">Summarise</a>

      </div>

      {filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <TransactionCard 
              key={transaction.id} 
              transaction={transaction}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass rounded-3xl p-12 flex flex-col items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <FiInbox className="text-white/40 text-4xl" />
          </div>
          <h3 className="font-space font-semibold text-white text-lg mb-2">
            No transactions yet
          </h3>
          <p className="font-rajdhani text-white/40 text-sm text-center">
            Start by adding money to your wallet
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
