import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { RiWhatsappFill, RiTelegramFill, RiShareFill } from 'react-icons/ri';
import Toast from './Toast';

const ReferralCard = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = `Join me on this amazing wallet app! Use my referral code: ${referralCode} and get ₹100 bonus!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setToastMessage('Opening WhatsApp...');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const shareViaTelegram = () => {
    const text = `Join me on this amazing wallet app! Use my referral code: ${referralCode} and get ₹100 bonus!`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setToastMessage('Opening Telegram...');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const shareGeneric = async () => {
    const shareData = {
      title: 'Join My Wallet',
      text: `Use my referral code: ${referralCode} and get ₹100 bonus!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setToastMessage('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setToastMessage('Link copied to clipboard!');
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="liquid-glass rounded-3xl p-6 mb-8 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="font-grotesk text-lg font-semibold text-white mb-1">
            Invite & Earn ₹100
          </h3>
          <p className="font-rajdhani text-sm text-white/50 mb-5">
            Share your code with friends
          </p>

          {/* Referral Code Display */}
          <div className="liquid-button rounded-2xl p-4 mb-5 flex items-center justify-between">
            <span className="font-orbitron text-2xl font-bold text-accent-cyan tracking-widest">
              {referralCode}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={copyToClipboard}
              className="liquid-button w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/10"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <FiCheck className="text-green-400" size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <FiCopy className="text-white/70" size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Share Icons */}
          <div className="flex items-center gap-3">
            <span className="font-rajdhani text-sm text-white/50 uppercase tracking-wide text-xs">Share:</span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareViaWhatsApp}
                className="liquid-button w-11 h-11 rounded-xl flex items-center justify-center hover:bg-green-500/10"
              >
                <RiWhatsappFill className="text-green-400" size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareViaTelegram}
                className="liquid-button w-11 h-11 rounded-xl flex items-center justify-center hover:bg-blue-500/10"
              >
                <RiTelegramFill className="text-blue-400" size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareGeneric}
                className="liquid-button w-11 h-11 rounded-xl flex items-center justify-center hover:bg-accent-cyan/10"
              >
                <RiShareFill className="text-accent-cyan" size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 liquid-glass rounded-2xl px-4 py-2 flex items-center gap-2"
            >
              <FiCheck className="text-green-400" size={16} />
              <span className="font-rajdhani text-sm text-white font-medium">Copied!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Toast 
        message={toastMessage}
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default ReferralCard;

