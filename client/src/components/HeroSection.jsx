import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TbCurrencyRupee, TbCurrencyDollar } from 'react-icons/tb';

const HeroSection = ({ balance }) => {
  const [currency, setCurrency] = useState('inr');
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    const target = currency === 'inr' ? balance.inr : balance.usd;
    let start = 0;
    const duration = 1000; // 1 second
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayBalance(target);
        clearInterval(timer);
      } else {
        setDisplayBalance(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [currency, balance]);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'inr' ? 'usd' : 'inr');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass rounded-[32px] p-8 mb-8"
    >
      <div className="flex justify-between items-start mb-6">
        <p className="font-rajdhani text-white/50 text-sm font-medium tracking-wide uppercase">
          Available Balance
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCurrency}
          className="liquid-button w-10 h-10 rounded-full flex items-center justify-center"
        >
          <motion.div
            key={currency}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currency === 'inr' ? (
              <TbCurrencyRupee className="text-accent-cyan" size={22} />
            ) : (
              <TbCurrencyDollar className="text-accent-cyan" size={22} />
            )}
          </motion.div>
        </motion.button>
      </div>

      <motion.div
        key={currency}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-orbitron text-6xl font-bold text-white mb-2 tracking-tight"
      >
        {currency === 'inr' ? '₹' : '$'}
        {displayBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </motion.div>

      <p className="font-rajdhani text-white/30 text-xs uppercase tracking-wider">
        {currency === 'inr' ? 'Indian Rupees' : 'US Dollars'}
      </p>
    </motion.div>
  );
};

export default HeroSection;

