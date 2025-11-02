import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('🔑 Razorpay initialized with Key ID:', process.env.RAZORPAY_KEY_ID?.substring(0, 8) + '...');
console.log('🪙 Cryptomus initialized with UUID:', process.env.CRYPTOMUS_MERCHANT_UUID?.substring(0, 8) + '...');

// ============ RAZORPAY ENDPOINTS ============

/**
 * POST /api/create-order
 * Creates a Razorpay order
 */
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', description } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
      description: description || 'Add Money to Wallet',
    };

    console.log('📋 Creating Razorpay order:', options);

    const order = await razorpay.orders.create(options);

    console.log('✅ Razorpay order created:', order.id);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
});

/**
 * POST /api/verify-payment
 * Verifies the payment signature
 */
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === signature;

    if (!isSignatureValid) {
      console.error('❌ Invalid Razorpay signature');
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed - Invalid signature',
      });
    }

    console.log('🔐 Razorpay signature verified for payment:', paymentId);

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    console.log('✅ Razorpay payment verified:', {
      id: payment.id,
      amount: payment.amount / 100,
      status: payment.status,
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at,
      },
    });
  } catch (error) {
    console.error('❌ Error verifying Razorpay payment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment',
    });
  }
});

// ============ CRYPTOMUS ENDPOINTS ============

/**
 * Helper function to generate Cryptomus signature
 */
function generateCryptomusSignature(data, apiKey) {
  const sign = crypto
    .createHash('md5')
    .update(JSON.stringify(data) + apiKey)
    .digest('hex');
  return sign;
}

/**
 * POST /api/cryptomus/create-payment
 * Creates a Cryptomus payment invoice
 */
app.post('/api/cryptomus/create-payment', async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    const merchantUuid = process.env.CRYPTOMUS_MERCHANT_UUID;
    const apiKey = process.env.CRYPTOMUS_API_KEY;

    if (!merchantUuid || !apiKey) {
      throw new Error('Cryptomus credentials not configured');
    }

    // Prepare payload
    const payload = {
      merchant: merchantUuid,
      amount: amount.toString(),
      currency: 'USD', // Cryptomus uses USD
      order_id: `order_${Date.now()}`,
      url_return: `${process.env.FRONTEND_URL}/wallet`,
      url_callback: `http://localhost:${PORT}/api/cryptomus/webhook`,
      lifetime: 3600, // 1 hour expiry
      description: description || 'Add Money to Wallet',
      is_payment_required: 1,
    };

    // Generate signature
    const signature = generateCryptomusSignature(payload, apiKey);

    console.log('📋 Creating Cryptomus payment:', {
      orderId: payload.order_id,
      amount: payload.amount,
      currency: payload.currency,
    });

    // Create payment via Cryptomus API
    const response = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': merchantUuid,
        'sign': signature,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.result) {
      throw new Error(data.message || 'Failed to create payment');
    }

    console.log('✅ Cryptomus payment created:', data.result.uuid);

    res.json({
      success: true,
      payment: {
        uuid: data.result.uuid,
        url: data.result.url, // Payment link to redirect user
        order_id: payload.order_id,
        amount: payload.amount,
        currency: payload.currency,
      },
    });
  } catch (error) {
    console.error('❌ Error creating Cryptomus payment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment',
    });
  }
});

/**
 * POST /api/cryptomus/webhook
 * Receives payment confirmation from Cryptomus
 */
app.post('/api/cryptomus/webhook', async (req, res) => {
  try {
    const { signature, ...data } = req.body;
    const apiKey = process.env.CRYPTOMUS_API_KEY;

    // Verify webhook signature
    const expectedSignature = generateCryptomusSignature(data, apiKey);

    if (expectedSignature !== signature) {
      console.error('❌ Invalid Cryptomus webhook signature');
      return res.status(400).json({ success: false });
    }

    console.log('✅ Cryptomus webhook verified:', {
      status: data.status,
      order_id: data.order_id,
      amount: data.amount,
    });

    // Handle payment based on status
    if (data.status === 'paid' || data.status === 'completed') {
      console.log('💰 Payment confirmed:', data.order_id);
      // Update user's wallet here
    } else if (data.status === 'failed' || data.status === 'cancelled') {
      console.log('❌ Payment failed:', data.order_id);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error.message);
    res.status(500).json({ success: false });
  }
});

/**
 * GET /api/cryptomus/payment/:uuid
 * Check payment status
 */
app.get('/api/cryptomus/payment/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const merchantUuid = process.env.CRYPTOMUS_MERCHANT_UUID;
    const apiKey = process.env.CRYPTOMUS_API_KEY;

    const payload = {
      merchant: merchantUuid,
      uuid: uuid,
    };

    const signature = generateCryptomusSignature(payload, apiKey);

    const response = await fetch('https://api.cryptomus.com/v1/payment/info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant': merchantUuid,
        'sign': signature,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.result) {
      throw new Error(data.message || 'Payment not found');
    }

    console.log('✅ Cryptomus payment status:', data.result.status);

    res.json({
      success: true,
      payment: {
        uuid: data.result.uuid,
        status: data.result.status,
        amount: data.result.amount,
        currency: data.result.currency,
        from_amount: data.result.from_amount,
        from_currency: data.result.from_currency,
        order_id: data.result.order_id,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching Cryptomus payment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payment',
    });
  }
});

// ============ PAYPAL ENDPOINTS ============

/**
 * Helper: Get PayPal access token
 */
/**
 * Helper: Get PayPal access token with better debugging
 */
const getPayPalAccessToken = async () => {
  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || 'sandbox';

    // DEBUG: Check if credentials exist
    if (!clientId || !clientSecret) {
      console.error('❌ Missing PayPal credentials:');
      console.error('   PAYPAL_CLIENT_ID:', clientId ? '✅ Set' : '❌ Missing');
      console.error('   PAYPAL_CLIENT_SECRET:', clientSecret ? '✅ Set' : '❌ Missing');
      throw new Error('PayPal credentials not configured');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Switch between sandbox and live
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    console.log(`🔑 Requesting PayPal token (${mode.toUpperCase()})...`);
    console.log(`   Base URL: ${baseUrl}`);
    console.log(`   Client ID: ${clientId.substring(0, 10)}...`);

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    console.log(`📊 PayPal Response Status: ${response.status}`);

    const data = await response.json();

    // DEBUG: Check response
    if (!response.ok) {
      console.error('❌ PayPal Error Response:');
      console.error('   Status:', response.status);
      console.error('   Error:', data.error);
      console.error('   Error Description:', data.error_description);
      throw new Error(`PayPal API Error: ${data.error_description || data.error || 'Unknown error'}`);
    }

    if (!data.access_token) {
      console.error('❌ No access token in response:');
      console.error('   Response:', data);
      throw new Error('No access token returned from PayPal');
    }

    console.log('✅ PayPal access token obtained successfully');
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting PayPal token:', error.message);
    throw error;
  }
};


/**
 * POST /api/paypal/create-order
 * Creates a PayPal order
 */
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: (amount / 84).toFixed(2), // Convert INR to USD
          },
          description: description || 'Add Money to Wallet',
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/wallet?payment_status=success`,
        cancel_url: `${process.env.FRONTEND_URL}/wallet?payment_status=cancel`,
        user_action: 'PAY_NOW',
        brand_name: 'Premium Wallet',
      },
    };

    console.log(`📋 Creating PayPal order (${mode.toUpperCase()}) for $`, payload.purchase_units[0].amount.value);

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.id) {
      throw new Error(data.message || 'Failed to create PayPal order');
    }

    console.log('✅ PayPal order created:', data.id);

    const approveLink = data.links.find(link => link.rel === 'approve');

    res.json({
      success: true,
      order: {
        id: data.id,
        status: data.status,
        approve_url: approveLink?.href || null,
        amount: payload.purchase_units[0].amount.value,
        currency: 'USD',
      },
    });
  } catch (error) {
    console.error('❌ Error creating PayPal order:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order',
    });
  }
});

/**
 * POST /api/paypal/capture-order
 * Captures (approves) a PayPal order
 */
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    console.log(`📋 Capturing PayPal order (${mode.toUpperCase()}):`, orderId);

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (data.status !== 'COMPLETED') {
      throw new Error(data.message || 'Payment not completed');
    }

    console.log('✅ PayPal order captured:', orderId);

    const capture = data.purchase_units[0].payments.captures[0];

    res.json({
      success: true,
      message: 'Payment captured successfully',
      payment: {
        id: data.id,
        status: data.status,
        capture_id: capture.id,
        amount: capture.amount.value,
        currency: capture.amount.currency_code,
        payer_email: data.payer.email_address,
        payer_name: `${data.payer.name.given_name} ${data.payer.name.surname}`,
      },
    });
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to capture order',
    });
  }
});

/**
 * GET /api/paypal/order/:orderId
 * Get PayPal order details
 */
app.get('/api/paypal/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const accessToken = await getPayPalAccessToken();
    const mode = process.env.PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!data.id) {
      throw new Error('Order not found');
    }

    console.log('✅ PayPal order details fetched:', data.id);

    res.json({
      success: true,
      order: {
        id: data.id,
        status: data.status,
        amount: data.purchase_units[0].amount.value,
        currency: data.purchase_units[0].amount.currency_code,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching PayPal order:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order',
    });
  }
});

// ============ WISE ENDPOINTS ============

/**
 * POST /api/wise/create-quote
 * Creates a Wise quote for conversion
 */
/**
 * POST /api/wise/create-quote
 * Creates a Wise quote for conversion - FIXED VERSION
 */
app.post('/api/wise/create-quote', async (req, res) => {
  try {
    const { amount, sourceCurrency = 'INR', targetCurrency = 'USD' } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    const wiseApiKey = process.env.WISE_API_KEY;
    const wiseApiUrl = process.env.WISE_API_URL;

    if (!wiseApiKey) {
      throw new Error('Wise API key not configured');
    }

    console.log('📋 Creating Wise quote...');
    console.log('   Amount:', amount, sourceCurrency);
    console.log('   Target:', targetCurrency);
    console.log('   API URL:', wiseApiUrl);
    console.log('   API Key:', wiseApiKey.substring(0, 10) + '...');

    // Fixed payload - matches Wise API documentation
    const payload = {
      sourceCurrency: sourceCurrency,
      targetCurrency: targetCurrency,
      sourceAmount: parseFloat(amount),
    };

    console.log('📤 Sending payload:', JSON.stringify(payload));

    const response = await fetch(`${wiseApiUrl}/v3/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wiseApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('📊 Response Status:', response.status);

    const data = await response.json();

    console.log('📥 Response Data:', data);

    if (!response.ok) {
      console.error('❌ Wise API Error:');
      console.error('   Status:', response.status);
      console.error('   Message:', data.message || data.error);
      console.error('   Details:', data.errors || data);
      
      throw new Error(
        data.message || 
        data.errors?.[0]?.message || 
        `Wise API Error: ${response.status}`
      );
    }

    if (!data.id) {
      console.error('❌ No quote ID in response');
      throw new Error('Failed to create quote - no ID returned');
    }

    console.log('✅ Wise quote created:', data.id);

    res.json({
      success: true,
      quote: {
        id: data.id,
        sourceAmount: data.sourceAmount,
        sourceCurrency: data.sourceCurrency,
        targetAmount: data.targetAmount,
        targetCurrency: data.targetCurrency,
        rate: data.rate,
        rateType: data.rateType,
        createdTime: data.createdTime,
        expiresAt: data.expiresAt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating Wise quote:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create quote',
    });
  }
});


/**
 * POST /api/wise/create-recipient
 * Creates a recipient account for transfer
 */
/**
 * POST /api/wise/create-recipient
 * Creates a recipient account for transfer - FIXED
 */
app.post('/api/wise/create-recipient', async (req, res) => {
  try {
    const { accountNumber, currency, country, email, fullName } = req.body;

    if (!accountNumber || !currency || !country || !fullName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: accountNumber, currency, country, fullName',
      });
    }

    const wiseApiKey = process.env.WISE_API_KEY;
    const wiseApiUrl = process.env.WISE_API_URL;

    console.log('📋 Creating Wise recipient...');
    console.log('   Currency:', currency);
    console.log('   Country:', country);
    console.log('   Name:', fullName);

    // For testing - use simple USD bank account
    let accountDetails = {};
    
    if (currency === 'USD') {
      accountDetails = {
        accountNumber: '1234567890',
        routingNumber: '011000015',
        accountType: 'CHECKING',
        holderName: fullName,
      };
    } else if (currency === 'EUR') {
      accountDetails = {
        iban: accountNumber,
      };
    } else if (currency === 'GBP') {
      accountDetails = {
        accountNumber: accountNumber,
        sortCode: '200000',
      };
    }

    const payload = {
      currency: currency,
      country: country,
      accountHolderName: fullName,
      details: accountDetails,
      type: 'BANK_ACCOUNT',
    };

    console.log('📤 Sending:', JSON.stringify(payload));

    const response = await fetch(`${wiseApiUrl}/v1/accounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wiseApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('📥 Response Status:', response.status);
    console.log('📥 Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ Wise API Error:', data);
      throw new Error(
        data.message || 
        data.errors?.[0]?.message || 
        'Failed to create recipient account'
      );
    }

    if (!data.id) {
      throw new Error('No account ID returned');
    }

    console.log('✅ Wise recipient created:', data.id);

    res.json({
      success: true,
      recipient: {
        id: data.id,
        currency: data.currency,
        country: data.country,
        accountHolderName: data.accountHolderName,
        type: data.type,
      },
    });
  } catch (error) {
    console.error('❌ Error creating recipient:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create recipient',
    });
  }
});

/**
 * POST /api/wise/create-transfer
 * Creates a transfer order (requires manual approval via Wise)
 */
app.post('/api/wise/create-transfer', async (req, res) => {
  try {
    const { quoteId, recipientId, customReference } = req.body;

    if (!quoteId || !recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Quote ID and Recipient ID required',
      });
    }

    const wiseApiKey = process.env.WISE_API_KEY;
    const wiseApiUrl = process.env.WISE_API_URL;

    const payload = {
      targetAccount: recipientId,
      quoteUuid: quoteId,
      customerTransactionId: `transfer_${Date.now()}`,
      details: {
        reference: customReference || 'Wallet Transfer',
        transferPurpose: 'personal',
        transferPurposeSubTransferPurpose: 'verification.transfers.purpose.pay_bills',
      },
    };

    console.log('📋 Creating Wise transfer for quote:', quoteId);

    const response = await fetch(`${wiseApiUrl}/v1/transfers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wiseApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      console.error('❌ Wise Error:', data);
      throw new Error(data.message || 'Failed to create transfer');
    }

    console.log('✅ Wise transfer created:', data.id);
    console.log('⚠️  Transfer requires manual approval at:', data.paymentUri);

    res.json({
      success: true,
      transfer: {
        id: data.id,
        status: data.status,
        sourceAmount: data.sourceAmount,
        targetAmount: data.targetAmount,
        rate: data.rate,
        paymentUri: data.paymentUri || null,
        reference: data.details?.reference,
      },
    });
  } catch (error) {
    console.error('❌ Error creating Wise transfer:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create transfer',
    });
  }
});

/**
 * GET /api/wise/transfer/:transferId
 * Get transfer status
 */
app.get('/api/wise/transfer/:transferId', async (req, res) => {
  try {
    const { transferId } = req.params;

    const wiseApiKey = process.env.WISE_API_KEY;
    const wiseApiUrl = process.env.WISE_API_URL;

    console.log('🔍 Fetching Wise transfer:', transferId);

    const response = await fetch(`${wiseApiUrl}/v1/transfers/${transferId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${wiseApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      throw new Error('Transfer not found');
    }

    console.log('✅ Wise transfer status:', data.status);

    res.json({
      success: true,
      transfer: {
        id: data.id,
        status: data.status,
        sourceAmount: data.sourceAmount,
        targetAmount: data.targetAmount,
        sourceCurrency: data.sourceCurrency,
        targetCurrency: data.targetCurrency,
        rate: data.rate,
        reference: data.details?.reference,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching Wise transfer:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch transfer',
    });
  }
});

/**
 * GET /api/wise/rates
 * Get current exchange rates
 */
app.get('/api/wise/rates', async (req, res) => {
  try {
    const { source = 'INR', target = 'USD' } = req.query;

    const wiseApiKey = process.env.WISE_API_KEY;
    const wiseApiUrl = process.env.WISE_API_URL;

    console.log('💹 Fetching Wise rates:', `${source} → ${target}`);

    const response = await fetch(
      `${wiseApiUrl}/v1/rates?source=${source}&target=${target}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${wiseApiKey}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch rates');
    }

    console.log('✅ Wise rates fetched');

    res.json({
      success: true,
      rates: data,
    });
  } catch (error) {
    console.error('❌ Error fetching Wise rates:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rates',
    });
  }
});



// ============ HEALTH CHECK ============

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    payments: {
      razorpay: !!process.env.RAZORPAY_KEY_ID,
      cryptomus: !!process.env.CRYPTOMUS_MERCHANT_UUID,
    },
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🚨 Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Wallet Payment Server Running');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🌐 CORS Origin: ${process.env.FRONTEND_URL}`);
  console.log(`💳 Razorpay: Enabled`);
  console.log(`🪙 Cryptomus: Enabled\n`);
});
