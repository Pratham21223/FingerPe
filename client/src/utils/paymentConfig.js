// Payment gateway configuration
export const PAYMENT_CONFIG = {
  API_URL: 'https://server-black-chi.vercel.app'
};

// ============ RAZORPAY ============

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Razorpay script loaded');
      resolve(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount, description) => {
  try {
    console.log('📋 Creating Razorpay order for ₹', amount);

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        description,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create order');
    }

    console.log('✅ Razorpay order created:', data.order.id);
    return data.order;
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
  try {
    console.log('🔐 Verifying Razorpay payment...');

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        paymentId,
        signature,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Payment verification failed');
    }

    console.log('✅ Razorpay payment verified:', data.payment);
    return data;
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    throw error;
  }
};

export const openRazorpayCheckout = async (order, userData) => {
  try {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: 'Premium Wallet',
        description: 'Add Money to Your Wallet',
        image: 'https://via.placeholder.com/150',
        
        prefill: {
          name: userData.name || 'User',
          email: userData.email || '',
          contact: userData.contact || '',
        },

        theme: {
          color: '#00d4ff',
        },

        handler: function (response) {
          console.log('✅ Razorpay payment successful:', response);
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },

        modal: {
          ondismiss: function () {
            console.log('❌ Razorpay payment cancelled');
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error('❌ Razorpay payment failed:', response.error);
        reject(new Error(response.error.reason || 'Payment failed'));
      });

      rzp.open();
    });
  } catch (error) {
    console.error('❌ Error opening Razorpay checkout:', error);
    throw error;
  }
};

// ============ CRYPTOMUS ============

export const createCryptomusPayment = async (amount, description) => {
  try {
    console.log('📋 Creating Cryptomus payment for $', amount);

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/cryptomus/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        description,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create payment');
    }

    console.log('✅ Cryptomus payment created:', data.payment.uuid);
    return data.payment;
  } catch (error) {
    console.error('❌ Error creating Cryptomus payment:', error);
    throw error;
  }
};

export const openCryptomusCheckout = async (payment) => {
  try {
    console.log('🌐 Opening Cryptomus checkout...');
    // Redirect to Cryptomus payment page
    window.location.href = payment.url;
    
    return new Promise((resolve) => {
      // Resolve after short delay
      setTimeout(() => {
        resolve({
          success: true,
          uuid: payment.uuid,
        });
      }, 1000);
    });
  } catch (error) {
    console.error('❌ Error opening Cryptomus checkout:', error);
    throw error;
  }
};

export const checkCryptomusPaymentStatus = async (uuid) => {
  try {
    console.log('🔍 Checking Cryptomus payment status...');

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/cryptomus/payment/${uuid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to check payment status');
    }

    console.log('✅ Cryptomus payment status:', data.payment.status);
    return data.payment;
  } catch (error) {
    console.error('❌ Error checking payment status:', error);
    throw error;
  }
};

// ============ PAYPAL ============

export const createPayPalOrder = async (amount, description) => {
  try {
    console.log('📋 Creating PayPal order for ₹', amount);

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/paypal/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        description,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create order');
    }

    console.log('✅ PayPal order created:', data.order.id);
    return data.order;
  } catch (error) {
    console.error('❌ Error creating PayPal order:', error);
    throw error;
  }
};

export const openPayPalCheckout = async (order) => {
  try {
    console.log('🌐 Opening PayPal checkout...');
    
    if (!order.approve_url) {
      throw new Error('PayPal approval URL not found');
    }

    // Redirect to PayPal
    window.location.href = order.approve_url;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: order.id,
        });
      }, 1000);
    });
  } catch (error) {
    console.error('❌ Error opening PayPal checkout:', error);
    throw error;
  }
};

export const capturePayPalOrder = async (orderId) => {
  try {
    console.log('✅ Capturing PayPal order:', orderId);

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/paypal/capture-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to capture order');
    }

    console.log('✅ PayPal payment captured:', data.payment);
    return data.payment;
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error);
    throw error;
  }
};

export const getPayPalOrder = async (orderId) => {
  try {
    console.log('🔍 Fetching PayPal order:', orderId);

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/paypal/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch order');
    }

    console.log('✅ PayPal order details:', data.order);
    return data.order;
  } catch (error) {
    console.error('❌ Error fetching PayPal order:', error);
    throw error;
  }
};

// ============ WISE ============

export const getWiseRates = async (source = 'INR', target = 'USD') => {
  try {
    console.log('💹 Fetching Wise rates:', `${source} → ${target}`);

    const response = await fetch(
      `${PAYMENT_CONFIG.API_URL}/api/wise/rates?source=${source}&target=${target}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch rates');
    }

    console.log('✅ Wise rates:', data.rates);
    return data.rates;
  } catch (error) {
    console.error('❌ Error fetching Wise rates:', error);
    throw error;
  }
};

export const createWiseQuote = async (amount, sourceCurrency = 'INR', targetCurrency = 'USD') => {
  try {
    console.log('📋 Creating Wise quote:', {
      amount,
      from: sourceCurrency,
      to: targetCurrency,
    });

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/wise/create-quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        sourceCurrency,
        targetCurrency,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create quote');
    }

    console.log('✅ Wise quote created:', data.quote.id);
    return data.quote;
  } catch (error) {
    console.error('❌ Error creating Wise quote:', error);
    throw error;
  }
};

export const createWiseRecipient = async (accountDetails) => {
  try {
    console.log('📋 Creating Wise recipient...');

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/wise/create-recipient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountDetails),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create recipient');
    }

    console.log('✅ Wise recipient created:', data.recipient.id);
    return data.recipient;
  } catch (error) {
    console.error('❌ Error creating Wise recipient:', error);
    throw error;
  }
};

export const createWiseTransfer = async (quoteId, recipientId, reference) => {
  try {
    console.log('📋 Creating Wise transfer...');

    const response = await fetch(`${PAYMENT_CONFIG.API_URL}/api/wise/create-transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId,
        recipientId,
        customReference: reference,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to create transfer');
    }

    console.log('✅ Wise transfer created:', data.transfer.id);
    return data.transfer;
  } catch (error) {
    console.error('❌ Error creating Wise transfer:', error);
    throw error;
  }
};

export const getWiseTransferStatus = async (transferId) => {
  try {
    console.log('🔍 Fetching Wise transfer status...');

    const response = await fetch(
      `${PAYMENT_CONFIG.API_URL}/api/wise/transfer/${transferId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch transfer status');
    }

    console.log('✅ Wise transfer status:', data.transfer.status);
    return data.transfer;
  } catch (error) {
    console.error('❌ Error fetching transfer status:', error);
    throw error;
  }
};