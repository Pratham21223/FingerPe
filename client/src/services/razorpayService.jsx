import axios from 'axios';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server-black-chi.vercel.app/api';


// Process UPI transfer via Razorpay
export const processUPITransfer = async (paymentData) => {
  try {
    console.log('Processing UPI Transfer:', paymentData);

    const response = await axios.post(`${API_BASE_URL}/payment/transfer`, {
      amount: paymentData.amount * 100, // Convert to paise
      upiId: paymentData.upiCode, // Full UPI URL from QR
      recipientName: paymentData.name,
      description: `Payment to ${paymentData.name}`
    });

    console.log('Transfer Response:', response.data);
    return {
      success: true,
      transactionId: response.data.transactionId,
      orderId: response.data.orderId,
      amount: paymentData.amount,
      recipient: paymentData.name,
      upiId: paymentData.upiCode,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Transfer Error:', error);
    throw {
      success: false,
      error: error.response?.data?.message || 'Transfer failed',
      details: error.message
    };
  }
};

// Verify payment status
export const verifyPaymentStatus = async (orderId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment/verify/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Verification Error:', error);
    throw error;
  }
};
