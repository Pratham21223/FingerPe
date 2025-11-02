import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiSmartphone, FiHash } from 'react-icons/fi';
import { AiOutlineQrcode } from 'react-icons/ai';
import Toast from './Toast';

const SendReceiveButtons = ({ onReceiveClick, onUpiIdClick, onScanQR }) => {
  const [sendExpanded, setSendExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const sendOptions = [
    { 
      id: 1, 
      icon: FiSmartphone, 
      label: "Phone", 
      position: { x: -85, y: -70 },
      onClick: () => {
        setToastMessage('Phone payment opened');
        setToastType('info');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        setSendExpanded(false);
      }
    },
    { 
      id: 2, 
      icon: AiOutlineQrcode, 
      label: "Scan QR", 
      position: { x: -110, y: 0 },
      onClick: () => {
        onScanQR?.();
        setSendExpanded(false);
      }
    },
    { 
      id: 3, 
      icon: FiHash, 
      label: "UPI ID", 
      position: { x: -85, y: 70 },
      onClick: () => {
        onUpiIdClick?.();
        setSendExpanded(false);
      }
    },
  ];

  return (
    <>
      <motion.div 
        className="relative flex justify-center items-center mb-6"
        style={{ gap: 48 }}
        animate={{ 
          height: sendExpanded ? 200 : 160,
          gap: sendExpanded ? 40 : 48,
          x: sendExpanded ? 60 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Send Button Container */}
        <div className="relative flex items-center justify-center">
          {/* Sub-buttons */}
          <AnimatePresence>
            {sendExpanded && sendOptions.map((option) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x: option.position.x, y: option.position.y }}
                exit={{ opacity: 0, scale: 0, x: 0, y: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={(e) => {
                  e.stopPropagation();
                  option.onClick?.();
                }}
                className="absolute liquid-button w-16 h-16 rounded-full flex flex-col items-center justify-center hover:bg-white/10 z-50 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <option.icon className="text-white/80" size={20} />
                <span className="text-[0.55rem] text-white/60 font-rajdhani mt-0.5 font-medium">
                  {option.label}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Main Send Button */}
          <motion.button
            onClick={() => setSendExpanded(!sendExpanded)}
            className="liquid-button rounded-full flex flex-col items-center justify-center gap-2 z-50 cursor-pointer relative"
            initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              width: sendExpanded ? 115 : 130,
              height: sendExpanded ? 115 : 130,
              background: sendExpanded ? "rgba(0, 212, 255, 0.15)" : "rgba(255, 255, 255, 0.05)",
              rotate: sendExpanded ? 15 : 0,
            }}
            transition={{ 
              scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.5 },
              width: { duration: 0.15, ease: "easeOut" },
              height: { duration: 0.15, ease: "easeOut" },
              background: { duration: 0.15 },
              rotate: { duration: 0.2, ease: "easeOut" }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.svg
              width={sendExpanded ? 24 : 30}
              height={sendExpanded ? 28 : 34}
              viewBox="0 0 24 28"
              fill="none"
              className={`transition-colors duration-150 ${sendExpanded ? "text-accent-cyan" : "text-white"}`}
            >
              <path
                d="M12 4L12 22M12 4L7 9M12 4L17 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            <span className={`font-grotesk font-medium transition-all duration-150 ${sendExpanded ? "text-accent-cyan text-sm" : "text-white/80 text-base"}`}>
              Send
            </span>
          </motion.button>
        </div>

        {/* Receive Button */}
        <motion.button
          onClick={onReceiveClick}
          className="liquid-button rounded-full flex flex-col items-center justify-center gap-2 cursor-pointer"
          initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            rotate: 0,
            width: sendExpanded ? 115 : 130,
            height: sendExpanded ? 115 : 130,
            marginLeft: sendExpanded ? '-20px' : '0px',
          }}
          transition={{ 
            scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
            opacity: { duration: 0.5, delay: 0.1 }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.svg
            width={30}
            height={34}
            viewBox="0 0 24 28"
            fill="none"
            className="text-white"
          >
            <path
              d="M12 22L12 4M12 22L17 17M12 22L7 17"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          <span className="text-base font-grotesk font-medium text-white/80">
            Receive
          </span>
        </motion.button>

        {/* Backdrop */}
        <AnimatePresence>
          {sendExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSendExpanded(false)}
              className="fixed inset-0 z-30 bg-transparent"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <Toast 
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default SendReceiveButtons;
