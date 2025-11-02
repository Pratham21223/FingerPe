import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

const BalanceCard = ({ balance }) => {
  const [displayBalance, setDisplayBalance] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest * 100) / 100);

  useEffect(() => {
    const controls = animate(count, balance, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayBalance(latest);
      }
    });
    
    return controls.stop;
  }, [balance, count]);

  // Particle background animation
  const particles = Array.from({ length: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative liquid-glass rounded-[32px] p-8 mb-6 overflow-hidden"
      style={{
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.15)',
      }}
    >
      {/* Animated particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-electric-blue/30 rounded-full particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 20 - 10],
              y: [0, Math.random() * 20 - 10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient border glow */}
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-electric-blue/20 via-neon-cyan/20 to-purple-500/20 opacity-50 blur-xl" />
      
      <div className="relative z-10">
        <p className="font-rajdhani font-light text-white/60 text-sm mb-2 tracking-wide">
          CURRENT BALANCE
        </p>
        
        <motion.h1 
          className="font-orbitron font-bold text-5xl text-white mb-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          ₹{displayBalance.toLocaleString('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </motion.h1>
        
        <motion.p 
          className="font-rajdhani text-white/40 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Available for withdrawal
        </motion.p>
      </div>
    </motion.div>
  );
};

export default BalanceCard;
