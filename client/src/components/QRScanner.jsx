import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck } from 'react-icons/fi';
import QrScanner from 'qr-scanner';

// Persistent Particle Component
const PersistentParticle = ({ index }) => {
  const xPos = Math.random() * 100;
  const yPos = Math.random() * 100;
  
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{
        left: `${xPos}%`,
        top: `${yPos}%`,
        background: `radial-gradient(circle, rgba(0, 212, 255, 0.8), rgba(0, 255, 242, 0.2))`,
        boxShadow: '0 0 15px rgba(0, 212, 255, 0.8), 0 0 30px rgba(0, 212, 255, 0.4)'
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.sin(index) * 20, 0],
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.2, 0.8]
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2
      }}
    />
  );
};

// Floating Orbs
const FloatingOrb = ({ delay, size, blur }) => (
  <motion.div
    animate={{
      y: [0, -40, 0],
      opacity: [0.1, 0.3, 0.1]
    }}
    transition={{
      duration: 6 + Math.random() * 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
    className={`absolute rounded-full ${size} ${blur} pointer-events-none`}
    style={{
      background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3), transparent)',
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`
    }}
  />
);

const QRScanner = ({ isOpen, onClose, onScan }) => {
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [upiData, setUpiData] = useState(null);
  const [validUPI, setValidUPI] = useState(false);
  const [upiName, setUpiName] = useState('');

  // Extract UPN (name) from UPI URL
  const extractUPIName = (upiUrl) => {
    const match = upiUrl.match(/pn=([^&]+)/);
    if (match && match[1]) {
      // Decode URL encoding (%20 -> space, %40 -> @, etc)
      const encodedName = match[1];
      const decodedName = decodeURIComponent(encodedName);
      return decodedName;
    }
    return '';
  };

  const validateUPI = (data) => {
    const upiRegex = /^upi:\/\//i;
    return upiRegex.test(data);
  };

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        const data = result.data;
        console.log('QR Code scanned:', data);

        if (validateUPI(data)) {
          console.log('✅ Valid UPI QR Code detected!');
          const name = extractUPIName(data);
          console.log('UPI Name:', name);
          
          setUpiData(data);
          setUpiName(name);
          setValidUPI(true);
          setScannedData(data);
          setScanning(false);

          const upiVariable = { qrCode: data, name: name, timestamp: new Date().toISOString() };
          console.log('=== UPI QR CODE STORED ===');
          console.log(JSON.stringify(upiVariable, null, 2));

          onScan?.(data);

          setTimeout(() => {
            onClose();
          }, 2500);
        } else {
          console.log('❌ Invalid UPI QR Code');
          setScannedData(null);
          setValidUPI(false);
        }
      },
      {
        onDecodeError: (error) => {
          // Suppress error logs
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 5,
      }
    );

    setScanner(qrScanner);
    qrScanner.start();

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [isOpen]);

  const handleClose = () => {
    if (scanner) {
      scanner.stop();
      scanner.destroy();
    }
    setScannedData(null);
    setValidUPI(false);
    setUpiData(null);
    setUpiName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Sci-Fi Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9998] bg-black/98 backdrop-blur-2xl overflow-hidden"
          >
            {/* Animated grid background */}
            <motion.div
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 212, 255, 0.1) 25%, rgba(0, 212, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 212, 255, 0.1) 75%, rgba(0, 212, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 212, 255, 0.1) 25%, rgba(0, 212, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 212, 255, 0.1) 75%, rgba(0, 212, 255, 0.1) 76%, transparent 77%, transparent)`,
                backgroundSize: '50px 50px'
              }}
            />

            {/* Animated gradient glows */}
            <motion.div
              animate={{
                opacity: [0.15, 0.4, 0.15],
                scale: [1, 1.4, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut"
              }}
              className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full blur-3xl"
            />

            <motion.div
              animate={{
                opacity: [0.1, 0.35, 0.1],
                scale: [1, 1.3, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-l from-purple-600 to-accent-cyan rounded-full blur-3xl"
            />

            {/* Persistent particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <PersistentParticle key={i} index={i} />
              ))}
            </div>

            {/* Floating orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <FloatingOrb delay={0} size="w-32 h-32" blur="blur-3xl" />
              <FloatingOrb delay={1} size="w-40 h-40" blur="blur-2xl" />
              <FloatingOrb delay={2} size="w-28 h-28" blur="blur-3xl" />
            </div>

            {/* Animated scan lines overlay */}
            <motion.div
              animate={{ y: ['0%', '100%'] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "linear"
              }}
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, rgba(0, 212, 255, 0.5) 0px, transparent 2px, transparent 4px)`,
                backgroundSize: '100% 4px',
                pointerEvents: 'none'
              }}
            />
          </motion.div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClose}
            className="fixed top-8 right-8 z-[10000] w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-xl border-2 border-accent-cyan/60 bg-black/40 hover:bg-accent-cyan/10 transition-all"
          >
            <FiX className="text-accent-cyan" size={32} />
          </motion.button>

          {/* Scanner Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 18, stiffness: 300 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Video Feed */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-3xl"
                style={{ display: 'block' }}
              />

              {/* Scanner Frame */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-3xl overflow-hidden"
              >
                {/* Pulsing outer ring */}
                <motion.div
                  animate={{
                    boxShadow: [
                      '0 0 0 2px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.4)',
                      '0 0 0 8px rgba(0, 212, 255, 0.1), 0 0 40px rgba(0, 212, 255, 0.6)',
                      '0 0 0 2px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.4)',
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-3xl"
                />

                {/* Main scanner frame */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative w-80 h-80 border-3 border-accent-cyan rounded-3xl bg-gradient-to-br from-accent-cyan/8 via-transparent to-transparent"
                  style={{
                    boxShadow: `
                      inset 0 0 40px rgba(0, 212, 255, 0.1),
                      0 0 50px rgba(0, 212, 255, 0.4),
                      0 0 100px rgba(0, 212, 255, 0.2)
                    `
                  }}
                >
                  {/* Animated corner glows */}
                  {[0, 1, 2, 3].map((corner) => (
                    <motion.div
                      key={corner}
                      animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [0.8, 1.1, 0.8]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: corner * 0.5,
                        ease: "easeInOut"
                      }}
                      className={`absolute w-8 h-8 border-2 border-accent-cyan rounded-lg pointer-events-none ${
                        corner === 0 ? '-top-2 -left-2' :
                        corner === 1 ? '-top-2 -right-2' :
                        corner === 2 ? '-bottom-2 -left-2' :
                        '-bottom-2 -right-2'
                      }`}
                      style={{
                        boxShadow: 'inset 0 0 15px rgba(0, 212, 255, 0.6)'
                      }}
                    />
                  ))}

                  {/* Center crosshair */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 border-2 border-accent-cyan/50 rounded-full" />
                      <div className="absolute inset-2 border border-accent-cyan/30 rounded-full" />
                      <motion.div
                        className="absolute inset-4 border-2 border-accent-cyan rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-accent-cyan"
                          animate={{
                            scale: [1, 1.5, 1],
                            boxShadow: [
                              '0 0 10px rgba(0, 212, 255, 0.6)',
                              '0 0 30px rgba(0, 212, 255, 0.8)',
                              '0 0 10px rgba(0, 212, 255, 0.6)'
                            ]
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* SIMPLE SCANNING LINE - UP AND DOWN */}
                  {scanning && (
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent"
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(0, 212, 255, 1))'
                      }}
                    />
                  )}

                  {/* Side decorative lines */}
                  <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    className="absolute left-0 top-1/3 bottom-1/3 w-0.5 bg-gradient-to-b from-transparent via-accent-cyan to-transparent"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.3 }}
                    className="absolute right-0 top-1/4 bottom-1/4 w-0.5 bg-gradient-to-b from-transparent via-accent-cyan to-transparent"
                  />
                </motion.div>
              </motion.div>

              {/* Success State */}
              <AnimatePresence>
                {validUPI && scannedData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-end justify-center p-8 rounded-3xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], y: [-10, 0, -10] }}
                      transition={{ duration: 0.8, repeat: 2 }}
                      className="text-center"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          scale: { duration: 0.6 },
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400/40 to-emerald-500/20 flex items-center justify-center mx-auto mb-4 border-2 border-green-400/50"
                        style={{
                          boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)'
                        }}
                      >
                        <FiCheck className="w-10 h-10 text-green-400" strokeWidth={3} />
                      </motion.div>
                      <p className="font-grotesk text-2xl text-green-400 font-bold">UPI Valid!</p>
                      <p className="font-rajdhani text-sm text-white/80 mt-3">Paying to {upiName}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QRScanner;

