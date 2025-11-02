import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import PaymentMethodCard from './PaymentMethodCard';
import WiseConfirmationModal from './WiseConfirmationModal';
import {
  openRazorpayCheckout,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createCryptomusPayment,
  openCryptomusCheckout,
  createPayPalOrder,
  openPayPalCheckout,
  capturePayPalOrder,
  createWiseQuote,
  createWiseRecipient,
  createWiseTransfer,
} from '../utils/paymentConfig';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const AddMoneyModal = ({ isOpen, onClose, paymentMethods, onSuccess }) => {
  // ============ STATE ============
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [wiseQuote, setWiseQuote] = useState(null);
  const [showWiseConfirmation, setShowWiseConfirmation] = useState(false);
  const navigate = useNavigate();

  // ============ EFFECTS ============

  useEffect(() => {
    console.log('AddMoneyModal isOpen:', isOpen);
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setSelectedMethod(null);
      setIsProcessing(false);
      setError(null);
      setWiseQuote(null);
      setShowWiseConfirmation(false);
    }
  }, [isOpen]);

  // Check if user is returning from PayPal payment
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('token');
      const paymentStatus = params.get('payment_status');

      if (orderId && paymentStatus === 'success') {
        handlePayPalReturn(orderId);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isOpen]);

  // ============ MAIN HANDLER ============

  const handleContinue = async () => {
    if (!amount || !selectedMethod) {
      setError('Please enter amount and select payment method');
      return;
    }

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (numAmount < 10) {
      setError('Minimum amount is ₹10');
      return;
    }

    if (numAmount > 100000) {
      setError('Maximum amount is ₹1,00,000');
      return;
    }

    // Route to correct payment method
    if (selectedMethod.name === 'Razorpay') {
      await handleRazorpayPayment(numAmount);
    } else if (selectedMethod.name === 'Cryptomus') {
      await handleCryptomusPayment(numAmount);
    } else if (selectedMethod.name === 'PayPal') {
      await handlePayPalPayment(numAmount);
    } else if (selectedMethod.name === 'Wise') {
      await handleWisePayment(numAmount);
    } else {
      // Demo payment for other methods
      handleDemoPayment(numAmount);
    }
  };

  // ============ RAZORPAY ============

  const handleRazorpayPayment = async (numAmount) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('Starting Razorpay payment for ₹', numAmount);

      // Step 1: Create order on backend
      const order = await createRazorpayOrder(numAmount, 'Add Money to Wallet');
      console.log('Order created:', order);

      // Step 2: Open Razorpay checkout
      const paymentResponse = await openRazorpayCheckout(order, {
        name: 'Wallet User',
        email: 'user@example.com',
        contact: '9999999999',
      });

      console.log('Payment response:', paymentResponse);

      // Step 3: Verify payment on backend
      const verificationResponse = await verifyRazorpayPayment(
        paymentResponse.orderId,
        paymentResponse.paymentId,
        paymentResponse.signature
      );

      console.log('Payment verified:', verificationResponse);

      // Step 4: Show success and update balance
      setIsProcessing(false);
      onSuccess(true, `Successfully added ₹${numAmount.toLocaleString('en-IN')} via Razorpay!`, numAmount);
      onClose();
    } catch (err) {
      console.error('Razorpay error:', err);
      setIsProcessing(false);
      setError(err.message || 'Payment failed. Please try again.');
      onSuccess(false, err.message || 'Razorpay payment failed');
    }
  };

  // ============ CRYPTOMUS ============

  // const handleCryptomusPayment = async (numAmount) => {
  //   setIsProcessing(true);
  //   setError(null);

  //   try {
  //     console.log('Starting Cryptomus payment for ₹', numAmount);

  //     // Convert INR to USD (approximate: 1 USD ≈ 84 INR)
  //     const usdAmount = (numAmount / 84).toFixed(2);
  //     console.log(`Converting ₹${numAmount} to $${usdAmount}`);

  //     // Step 1: Create payment on backend
  //     const payment = await createCryptomusPayment(usdAmount, 'Add Money to Wallet');
  //     console.log('Cryptomus payment created:', payment);

  //     // Step 2: Store payment UUID for later verification
  //     sessionStorage.setItem('cryptomusPaymentUUID', payment.uuid);
  //     sessionStorage.setItem('cryptomusPaymentAmount', numAmount);

  //     // Step 3: Redirect to Cryptomus checkout
  //     await openCryptomusCheckout(payment);

  //     // After user returns from payment
  //     setIsProcessing(false);
  //     onSuccess(true, `Redirecting to Cryptomus for ₹${numAmount.toLocaleString('en-IN')} payment...`, numAmount);
  //     onClose();
  //   } catch (err) {
  //     console.error('Cryptomus error:', err);
  //     setIsProcessing(false);
  //     setError(err.message || 'Payment failed. Please try again.');
  //     onSuccess(false, err.message || 'Cryptomus payment failed');
  //   }
  // };

  const handleCryptomusPayment = async (numAmount) => {
    window.location.href = "https://pay.cryptomus.com/wallet/a148b8b9-cdd5-4d3d-9be1-1c0756fe9085";
  }

  // ============ PAYPAL ============

  const handlePayPalPayment = async (numAmount) => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('Starting PayPal payment for ₹', numAmount);

      // Step 1: Create order on backend
      const order = await createPayPalOrder(numAmount, 'Add Money to Wallet');
      console.log('PayPal order created:', order);

      // Step 2: Store order ID for verification after redirect
      sessionStorage.setItem('paypalOrderId', order.id);
      sessionStorage.setItem('paypalAmount', numAmount);

      // Step 3: Redirect to PayPal checkout
      await openPayPalCheckout(order);

      setIsProcessing(false);
    } catch (err) {
      console.error('PayPal error:', err);
      setIsProcessing(false);
      setError(err.message || 'Payment failed. Please try again.');
      onSuccess(false, err.message || 'PayPal payment failed');
    }
  };

  const handlePayPalReturn = async (orderId) => {
    try {
      console.log('🔄 Processing PayPal return...');
      setIsProcessing(true);

      // Capture the order
      const payment = await capturePayPalOrder(orderId);
      console.log('PayPal payment captured:', payment);

      const amount = parseFloat(sessionStorage.getItem('paypalAmount'));

      setIsProcessing(false);
      onSuccess(true, `Successfully added ₹${amount.toLocaleString('en-IN')} via PayPal!`, amount);
      
      // Clear session storage
      sessionStorage.removeItem('paypalOrderId');
      sessionStorage.removeItem('paypalAmount');

      onClose();
    } catch (err) {
      console.error('PayPal return error:', err);
      setIsProcessing(false);
      setError('Payment verification failed. Please contact support.');
      onSuccess(false, err.message || 'PayPal payment verification failed');

      sessionStorage.removeItem('paypalOrderId');
      sessionStorage.removeItem('paypalAmount');
    }
  };

  // ============ WISE ============

  // const handleWisePayment = async (numAmount) => {
  //   setIsProcessing(true);
  //   setError(null);

  //   try {
  //     console.log('Starting Wise transfer for ₹', numAmount);

  //     // Step 1: Create a quote
  //     const quote = await createWiseQuote(numAmount, 'INR', 'USD');
  //     console.log('Wise quote created:', quote);

  //     if (!quote || !quote.id) {
  //       throw new Error('Failed to get valid quote');
  //     }

  //     // Step 2: Store quote and show confirmation modal
  //     setWiseQuote(quote);
  //     setShowWiseConfirmation(true);
  //     setIsProcessing(false);
  //   } catch (err) {
  //     console.error('Wise error:', err);
  //     setIsProcessing(false);
  //     setError(err.message || 'Failed to create quote. Please try again.');
  //     onSuccess(false, err.message || 'Wise quote creation failed');
  //   }
  // };

  const handleWisePayment = async (numAmount) => {
    window.location.href = "https://wise.com/pay/business/kailashbenhirengohil";
  }


  const handleWiseConfirm = async () => {
    if (!wiseQuote) return;

    setIsProcessing(true);
    setShowWiseConfirmation(false);
    setError(null);

    try {
      console.log('Confirmed Wise transfer');

      // Step 1: Create recipient
      const recipient = await createWiseRecipient({
        currency: 'USD',
        country: 'US',
        fullName: 'Wallet User',
        accountNumber: '1234567890',
        email: 'user@wallet.com',
      });

      console.log('Wise recipient created:', recipient);

      // Step 2: Create transfer
      const transfer = await createWiseTransfer(
        wiseQuote.id,
        recipient.id,
        `Wallet Transfer ${Date.now()}`
      );

      console.log('Wise transfer created:', transfer);

      sessionStorage.setItem('wiseTransferId', transfer.id);
      sessionStorage.setItem('wiseAmount', wiseQuote.sourceAmount);

      setIsProcessing(false);

      if (transfer.paymentUri) {
        window.location.href = transfer.paymentUri;
      } else {
        onSuccess(true, `Wise transfer initiated for ₹${wiseQuote.sourceAmount.toLocaleString('en-IN')}!`, wiseQuote.sourceAmount);
        onClose();
      }
    } catch (err) {
      console.error('Wise confirmation error:', err);
      setIsProcessing(false);
      setError(err.message || 'Transfer failed. Please try again.');
      onSuccess(false, err.message || 'Wise transfer failed');
    }
  };

  const handleWiseCancel = () => {
    setShowWiseConfirmation(false);
    setWiseQuote(null);
  };

  // ============ DEMO PAYMENT ============

  const handleDemoPayment = (numAmount) => {
    // Simulate other payment methods (Bank Transfer, etc.)
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(true, `Successfully added ₹${numAmount.toLocaleString('en-IN')} via ${selectedMethod.name}!`, numAmount);
      onClose();
    }, 2000);
  };

  // ============ MODAL HANDLERS ============

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  // ============ RENDER ============

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[998]"
              onClick={handleBackdropClick}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="liquid-glass rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="font-space font-bold text-2xl text-white">
                    Add Money to Wallet
                  </h2>
                  <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="w-10 h-10 rounded-full liquid-button flex items-center justify-center hover:bg-white/10 disabled:opacity-50"
                  >
                    <FiX className="text-white text-xl" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Error Alert */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                    >
                      <FiAlertCircle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                      <p className="font-rajdhani text-red-300 text-sm">
                        {error}
                      </p>
                    </motion.div>
                  )}

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="font-rajdhani text-white/60 text-sm mb-2 block">
                      Enter Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-orbitron text-2xl text-white/40 pointer-events-none z-10">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setError(null);
                        }}
                        placeholder="0.00"
                        min="10"
                        max="100000"
                        disabled={isProcessing}
                        className="w-full liquid-glass rounded-3xl px-5 pl-12 py-5 font-orbitron text-3xl text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-neon-cyan transition-all disabled:opacity-50"
                      />
                    </div>
                    <p className="font-rajdhani text-white/40 text-xs mt-2 ml-1">
                      Minimum: ₹10 • Maximum: ₹1,00,000
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="font-rajdhani text-white/60 text-sm mb-4 block">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map((method, index) => (
                        <PaymentMethodCard
                          key={method.id}
                          method={method}
                          isSelected={selectedMethod?.id === method.id}
                          onClick={() => {
                            if (!isProcessing) {
                              setSelectedMethod(method);
                              setError(null);
                            }
                          }}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Payment Info */}
                  {selectedMethod && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <p className="font-rajdhani text-white/60 text-sm">
                        You will be directed to <span className="font-semibold text-neon-cyan">{selectedMethod.name}</span> to complete the payment securely.
                        {(selectedMethod.name === 'Cryptomus' || selectedMethod.name === 'PayPal' || selectedMethod.name === 'Wise') && (
                          <span className="block mt-2 text-xs text-white/40">
                            Approximate: ${(parseFloat(amount) / 84).toFixed(2)} USD
                          </span>
                        )}
                        {selectedMethod.name === 'Wise' && (
                          <span className="block mt-2 text-xs text-white/40">
                            ⚠️ Wise transfer fee: ~$1-2 USD
                          </span>
                        )}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: selectedMethod && amount && !isProcessing ? 1.02 : 1 }}
                    whileTap={{ scale: selectedMethod && amount && !isProcessing ? 0.98 : 1 }}
                    onClick={handleContinue}
                    disabled={!selectedMethod || !amount || isProcessing}
                    className={clsx(
                      'w-full rounded-3xl py-5 font-space font-bold text-lg transition-all',
                      selectedMethod && amount && !isProcessing
                        ? 'bg-gradient-to-r from-neon-cyan to-electric-blue text-black cursor-pointer'
                        : 'bg-white/5 text-white/30 cursor-not-allowed'
                    )}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Processing Payment...
                      </span>
                    ) : (
                      'Continue to Payment'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Wise Confirmation Modal */}
      <WiseConfirmationModal
        isOpen={showWiseConfirmation}
        quote={wiseQuote}
        onConfirm={handleWiseConfirm}
        onCancel={handleWiseCancel}
      />
    </>
  );
};

export default AddMoneyModal;
