import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiX } from 'react-icons/fi';
import { processCommandWithGemini, extractPhoneNumber, extractAmount, findContactByName } from '../services/VoiceAi';

const VoiceModal = ({ isOpen, onClose, onScanQR, onPayContact, autoStart = false }) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);
  const [waveHeights, setWaveHeights] = useState(Array(12).fill(8));

  const [paymentData, setPaymentData] = useState({
    name: null,
    phoneNumber: null,
    amount: null
  });

  // Waveform animation
  useEffect(() => {
    if (!listening && !isProcessing) {
      setWaveHeights(Array(12).fill(8));
      return;
    }

    const interval = setInterval(() => {
      setWaveHeights((prev) =>
        prev.map(() => Math.floor(Math.random() * 60) + 20)
      );
    }, 80);

    return () => clearInterval(interval);
  }, [listening, isProcessing]);

  // Process transcripts
  const processFinalTranscript = async (finalText) => {
    if (!finalText.trim()) return;

    setIsProcessing(true);

    try {
      console.log('User:', finalText);

      // Check for scan QR
      if (finalText.toLowerCase().includes('scan') || finalText.toLowerCase().includes('qr')) {
        setResponse('Scanning QR code now');
        setTimeout(() => {
          onClose();
          setTimeout(() => onScanQR?.(), 300);
        }, 1000);
        setIsProcessing(false);
        return;
      }

      // Extract payment info
      const contact = findContactByName(finalText);
      const phoneFromText = extractPhoneNumber(finalText);
      const amountFromText = extractAmount(finalText);

      let updatedData = { ...paymentData };
      let aiResponse = '';

      // If we have a contact
      if (contact && !paymentData.name) {
        updatedData.name = contact.name;
        updatedData.phoneNumber = contact.number;

        if (amountFromText) {
          updatedData.amount = amountFromText;
          aiResponse = `Sending ₹${amountFromText} to ${contact.name}. Processing...`;
          setTimeout(() => {
            proceedToPayment(updatedData);
          }, 1500);
        } else {
          aiResponse = `Great! Sending to ${contact.name}. How much?`;
        }
      }
      // If name exists but no phone
      else if (paymentData.name && !paymentData.phoneNumber) {
        if (phoneFromText) {
          updatedData.phoneNumber = phoneFromText;
          if (amountFromText) {
            updatedData.amount = amountFromText;
            aiResponse = `Sending ₹${amountFromText}. Processing...`;
            setTimeout(() => {
              proceedToPayment(updatedData);
            }, 1500);
          } else {
            aiResponse = `How much to send?`;
          }
        } else {
          aiResponse = `What's ${paymentData.name}'s number?`;
        }
      }
      // If name & phone exist but no amount
      else if (paymentData.name && paymentData.phoneNumber && !paymentData.amount) {
        if (amountFromText) {
          updatedData.amount = amountFromText;
          aiResponse = `Sending ₹${amountFromText}. Processing...`;
          setTimeout(() => {
            proceedToPayment(updatedData);
          }, 1500);
        } else {
          aiResponse = `How much?`;
        }
      }
      // Default: use Gemini
      else {
        const aiOutput = await processCommandWithGemini(finalText);
        aiResponse = aiOutput.response;

        if (aiOutput.contactName) {
          const aiContact = findContactByName(aiOutput.contactName);
          if (aiContact) {
            updatedData.name = aiContact.name;
            updatedData.phoneNumber = aiContact.number;
          } else {
            updatedData.name = aiOutput.contactName;
          }
        }

        if (aiOutput.phoneNumber) {
          updatedData.phoneNumber = aiOutput.phoneNumber;
        }

        if (aiOutput.amount) {
          updatedData.amount = aiOutput.amount;
        }
      }

      setResponse(aiResponse);
      setTranscript('');
      setInterimTranscript('');
      setPaymentData(updatedData);

    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const proceedToPayment = (data) => {
    console.log('💳 Payment:', data);
    
    onClose();
    setTimeout(() => {
      onPayContact?.({
        name: data.name,
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        upiCode: `upi://pay?pa=${data.phoneNumber}@paytm&pn=${encodeURIComponent(data.name)}`
      });
    }, 300);
  };

  // Speech Recognition
  useEffect(() => {
    if (!isOpen) return;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setListening(true);
        setResponse('Listening...');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        if (final) {
          const fullTranscript = transcript + final;
          setTranscript(fullTranscript);
          processFinalTranscript(fullTranscript);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        setResponse('Could not hear clearly.');
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      if (autoStart) {
        setTimeout(() => {
          recognition.start();
        }, 500);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen, autoStart, transcript]);

  const toggleMic = () => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    } else if (recognitionRef.current && !listening) {
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
    }
  };

  const handleClose = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setTranscript('');
    setInterimTranscript('');
    setResponse('');
    setListening(false);
    setIsProcessing(false);
    setPaymentData({ name: null, phoneNumber: null, amount: null });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-2xl"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-8 left-4 right-4 z-[9999] max-w-md mx-auto"
          >
            <div className="relative">
              <div className="liquid-glass rounded-[40px] p-8 shadow-2xl">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="absolute top-4 right-4 liquid-button w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <FiX className="text-white/70" size={20} />
                </motion.button>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-8"
                >
                  <h2 className="font-grotesk text-2xl font-bold text-white mb-2">
                    Hello, Fingu
                  </h2>
                  <p className="font-rajdhani text-sm text-white/50 uppercase tracking-wider">
                    {isProcessing ? '🤖 Processing...' : listening ? '👂 Listening...' : 'Tap mic to speak'}
                  </p>
                </motion.div>

                <div className="flex items-center justify-center gap-1.5 mb-8 h-24">
                  {waveHeights.map((height, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height }}
                      transition={{ duration: 0.1, ease: "easeInOut" }}
                      className="w-1.5 bg-gradient-to-t from-accent-cyan to-accent-blue rounded-full"
                      style={{
                        minHeight: 8,
                        boxShadow: listening || isProcessing ? '0 0 10px rgba(0, 255, 242, 0.5)' : 'none'
                      }}
                    />
                  ))}
                </div>

                <div className="min-h-[120px] max-h-[200px] overflow-y-auto mb-6 space-y-3 pr-2">
                  {(transcript || interimTranscript || response) ? (
                    <>
                      {(transcript || interimTranscript) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="liquid-button rounded-2xl p-4 bg-white/5"
                        >
                          <p className="font-rajdhani text-xs text-white/60 uppercase mb-1">You</p>
                          <p className="font-grotesk text-white text-sm">
                            {transcript}
                            <span className="text-white/40 animate-pulse">{interimTranscript}</span>
                          </p>
                        </motion.div>
                      )}

                      {response && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="liquid-button rounded-2xl p-4 bg-accent-cyan/10 border border-accent-cyan/20"
                        >
                          <p className="font-rajdhani text-xs text-accent-cyan/60 uppercase mb-1">Fingu</p>
                          <p className="font-grotesk text-accent-cyan text-sm">{response}</p>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-24">
                      <p className="font-rajdhani text-white/30 text-sm">Say something...</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2 mb-4 text-xs font-rajdhani text-white/40">
                  <span className="bg-white/5 px-2 py-1 rounded">Gemini 2.5</span>
                  <span className="bg-white/5 px-2 py-1 rounded">Web Speech API</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isProcessing}
                  onClick={toggleMic}
                  className={`w-full liquid-button rounded-2xl py-4 flex items-center justify-center gap-3 transition-all disabled:opacity-50 ${
                    listening ? 'bg-accent-cyan/20' : 'hover:bg-white/10'
                  }`}
                >
                  <motion.div
                    animate={listening || isProcessing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ repeat: listening || isProcessing ? Infinity : 0, duration: 1.5 }}
                  >
                    <FiMic className={listening ? 'text-accent-cyan' : 'text-white/70'} size={24} />
                  </motion.div>
                  <span className={`font-grotesk font-medium ${listening ? 'text-accent-cyan' : 'text-white/80'}`}>
                    {isProcessing ? 'Processing' : listening ? 'Stop' : 'Start'}
                  </span>
                </motion.button>
              </div>

              {(listening || isProcessing) && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-accent-cyan rounded-[40px] blur-2xl -z-10"
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VoiceModal;
