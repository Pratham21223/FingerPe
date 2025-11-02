import { motion } from 'framer-motion';
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import clsx from 'clsx';

const TransactionCard = ({ transaction, index }) => {
  const isCredit = transaction.type === 'credit';
  const statusColors = {
    success: 'text-green-400 bg-green-400/10',
    pending: 'text-yellow-400 bg-yellow-400/10',
    failed: 'text-red-400 bg-red-400/10',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="liquid-glass rounded-2xl p-4 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={clsx(
          'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0',
          isCredit ? 'bg-green-400/10' : 'bg-red-400/10'
        )}>
          {isCredit ? (
            <FiArrowDownLeft className="text-green-400 text-xl" />
          ) : (
            <FiArrowUpRight className="text-red-400 text-xl" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-space font-semibold text-white text-base mb-1 truncate">
            {transaction.method}
          </h4>
          <p className="font-rajdhani text-white/40 text-xs mb-1 truncate">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-rajdhani text-white/60 text-xs">
              {formatDate(transaction.date)}
            </span>
            <span className="text-white/30">•</span>
            <span className="font-rajdhani text-white/60 text-xs">
              {formatTime(transaction.date)}
            </span>
          </div>
        </div>

        {/* Amount & Status */}
        <div className="flex flex-col items-end gap-2">
          <span className={clsx(
            'font-orbitron font-bold text-lg',
            isCredit ? 'text-green-400' : 'text-red-400'
          )}>
            {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
          </span>
          <span className={clsx(
            'px-3 py-1 rounded-full text-xs font-rajdhani font-medium',
            statusColors[transaction.status]
          )}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
