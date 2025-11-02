import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimationControls } from 'framer-motion';
import { FiGift, FiPercent, FiAward, FiStar, FiCheck, FiX } from 'react-icons/fi';
import { RiFlightTakeoffLine } from 'react-icons/ri';

const OffersBanner = ({ offers }) => {
  useEffect(() => {
  controls.start({
    x: -1000,
    transition: {
      duration: 25,
      ease: "linear",
      repeat: Infinity,
    }
  });
}, []);
  const [claimedOffers, setClaimedOffers] = useState([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);

  const iconMap = {
    gift: FiGift,
    percent: FiPercent,
    trophy: FiAward,
    star: FiStar,
    plane: RiFlightTakeoffLine,
  };

  const duplicatedOffers = [...offers, ...offers, ...offers];

  const handleClaim = (offer) => {
    setCurrentOffer(offer);
    setShowClaimModal(true);
    setTimeout(() => {
      setClaimedOffers([...claimedOffers, offer.id]);
      setShowClaimModal(false);
    }, 2000);
  };

  const handleHoverStart = () => {
    setIsPaused(true);
    controls.stop();
  };

  const handleHoverEnd = () => {
    setIsPaused(false);
    controls.start({
      x: -1000,
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      }
    });
  };

  return (
    <>
      <div 
        className="relative overflow-hidden mb-8"
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        <motion.div
          className="flex gap-3"
          animate={controls}
          initial={{ x: 0 }}
          onAnimationComplete={() => {
            if (!isPaused) {
              controls.set({ x: 0 });
              controls.start({
                x: -1000,
                transition: {
                  duration: 25,
                  ease: "linear",
                  repeat: Infinity,
                }
              });
            }
          }}
          style={{ width: 'max-content' }}
        >
          {duplicatedOffers.map((offer, index) => {
            const Icon = iconMap[offer.icon] || FiGift;
            const isClaimed = claimedOffers.includes(offer.id);
            
            return (
              <motion.div
                key={`${offer.id}-${index}`}
                className="liquid-glass rounded-3xl flex-shrink-0 w-80 p-5 flex items-center gap-4 hover:bg-white/[0.06] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="liquid-button w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="text-accent-cyan" size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-grotesk text-sm text-white/90 font-medium mb-1">
                    {offer.title}
                  </p>
                  <p className="font-rajdhani text-xs text-white/40 uppercase tracking-wider">
                    {offer.code}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: isClaimed ? 1 : 1.05 }}
                  whileTap={{ scale: isClaimed ? 1 : 0.95 }}
                  onClick={() => !isClaimed && handleClaim(offer)}
                  disabled={isClaimed}
                  className={`liquid-button px-5 py-2 rounded-full text-xs font-grotesk font-medium transition-all ${
                    isClaimed 
                      ? 'bg-green-500/20 text-green-400 cursor-default' 
                      : 'text-accent-cyan hover:bg-accent-cyan/10'
                  }`}
                >
                  {isClaimed ? <FiCheck size={16} /> : 'Claim'}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Claim Success Modal */}
      <AnimatePresence>
        {showClaimModal && currentOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[9999] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="liquid-glass rounded-3xl p-8 max-w-sm mx-4 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <FiCheck className="text-green-400" size={40} />
              </motion.div>
              <h3 className="font-grotesk text-xl font-bold text-white mb-2">
                Offer Claimed!
              </h3>
              <p className="font-rajdhani text-sm text-white/60 mb-3">
                {currentOffer.title}
              </p>
              <p className="font-orbitron text-accent-cyan text-lg">
                {currentOffer.code}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OffersBanner;




