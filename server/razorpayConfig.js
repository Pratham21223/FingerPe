// This file is for reference/testing only
// The actual config is used in server.js

export const RAZORPAY_CONFIG = {
  TEST_MODE: true,
  TIMEOUT: 30000,
};

export const TEST_CARDS = {
  success: {
    cardNumber: '4111111111111111',
    expiry: '12/25',
    cvv: '123',
  },
  failed: {
    cardNumber: '4000000000000002',
    expiry: '12/25',
    cvv: '123',
  },
};
