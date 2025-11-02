import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  const icons = {
    success: FiCheck,
    error: FiX,
    warning: FiAlertCircle,
    info: FiInfo,
  };

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/30',
    warning: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  };

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center pointer-events-none">
          <div className="w-full max-w-md px-4">
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 24, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`liquid-glass bg-gradient-to-r ${colors[type]} border rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-2xl`}>
                <div className="flex-shrink-0">
                  <Icon className={iconColors[type]} size={22} />
                </div>
                <p className="font-grotesk text-sm text-white font-medium flex-1">
                  {message}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="flex-shrink-0 text-white/50 hover:text-white/80 transition-colors"
                >
                  <FiX size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

// import { motion, AnimatePresence } from 'framer-motion';
// import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
// import { useEffect } from 'react';

// const Toast = ({ message, type = 'success', isVisible, onClose }) => {
//   useEffect(() => {
//     if (isVisible) {
//       const timer = setTimeout(() => {
//         onClose();
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [isVisible, onClose]);

//   const icons = {
//     success: <FiCheck className="text-green-400 text-xl" />,
//     error: <FiAlertCircle className="text-red-400 text-xl" />,
//     info: <FiAlertCircle className="text-blue-400 text-xl" />,
//   };

//   return (
//     <AnimatePresence>
//       {isVisible && (
//         <motion.div
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={{ y: -50, opacity: 0 }}
//           transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//           className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-full px-4"
//         >
//           <div className="liquid-glass rounded-3xl px-6 py-4 flex items-center gap-4 shadow-2xl">
//             {icons[type]}
//             <p className="flex-1 font-space font-medium text-white text-sm">
//               {message}
//             </p>
//             <button
//               onClick={onClose}
//               className="text-white/60 hover:text-white transition-colors"
//             >
//               <FiX className="text-lg" />
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Toast;

