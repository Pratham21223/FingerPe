import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiShare2 } from 'react-icons/fi';
import { AiOutlineQrcode } from 'react-icons/ai';
import Toast from './Toast';

const ReceiveModal = ({ isOpen, onClose, referralCode }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const handleSave = () => {
    setToastMessage('QR Code saved successfully!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'My Payment QR',
      text: `Pay me using UPI: ${referralCode.toLowerCase()}@wallet`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setToastMessage('Shared successfully!');
        setToastType('success');
      } else {
        await navigator.clipboard.writeText(`Pay me: ${referralCode.toLowerCase()}@wallet`);
        setToastMessage('UPI ID copied to clipboard!');
        setToastType('success');
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="liquid-glass rounded-[40px] p-8 max-w-sm w-full relative">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-5 right-5 liquid-button w-11 h-11 rounded-xl flex items-center justify-center"
                >
                  <FiX className="text-white/70" size={20} />
                </motion.button>

                {/* Title */}
                <h2 className="font-grotesk text-2xl font-semibold text-white mb-1 text-center">
                  Receive Payment
                </h2>
                <p className="font-rajdhani text-sm text-white/50 mb-8 text-center">
                  Scan QR code to receive money
                </p>

                {/* QR Code */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="liquid-button rounded-3xl p-8 mb-6 flex items-center justify-center"
                >
                  <div className="bg-white p-6 rounded-3xl">
                    <AiOutlineQrcode className="text-black" size={180} />
                  </div>
                </motion.div>

                {/* UPI ID */}
                <div className="liquid-button rounded-2xl p-4 mb-6 text-center">
                  <p className="font-rajdhani text-xs text-white/40 mb-1 uppercase tracking-wider">Your UPI ID</p>
                  <p className="font-orbitron text-lg text-accent-cyan font-medium">
                    {referralCode.toLowerCase()}@wallet
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 liquid-button rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <FiDownload size={18} className="text-white/70" />
                    <span className="font-grotesk font-medium text-sm text-white/90">Save</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="flex-1 liquid-button rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-accent-cyan/10 transition-all"
                  >
                    <FiShare2 size={18} className="text-accent-cyan" />
                    <span className="font-grotesk font-medium text-sm text-accent-cyan">Share</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Toast 
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default ReceiveModal;


