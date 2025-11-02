export const walletManagementData = {
  balance: {
    current: 45320.50,
    availableForWithdrawal: 44500.00,
  },
  
  paymentMethods: {
    addMoney: [
      { 
        id: 1, 
        name: "Razorpay", 
        subtitle: "UPI, Cards, Netbanking", 
        icon: "FiCreditCard", 
        fee: "₹0" 
      },
      { 
        id: 2, 
        name: "Cryptomus", 
        subtitle: "Cryptocurrency payments", 
        icon: "FaBitcoin", 
        fee: "1.5%" 
      },
      { 
        id: 3, 
        name: "PayPal", 
        subtitle: "International payments", 
        icon: "FaPaypal", 
        fee: "2.9%" 
      },
      { 
        id: 4, 
        name: "Wise", 
        subtitle: "Bank transfer", 
        icon: "SiWise", 
        fee: "1%" 
      },
      { 
        id: 5, 
        name: "Bank Transfer", 
        subtitle: "Direct bank deposit", 
        icon: "FiHome", 
        fee: "₹0" 
      },
    ],
    withdraw: [
      { 
        id: 1, 
        name: "Cryptocurrency", 
        subtitle: "BTC, ETH, USDT", 
        icon: "FaBitcoin", 
        fee: "Network fee", 
        time: "10-30 min" 
      },
      { 
        id: 2, 
        name: "Bank Transfer", 
        subtitle: "2-3 business days", 
        icon: "FiHome", 
        fee: "₹0", 
        time: "2-3 days" 
      },
      { 
        id: 3, 
        name: "UPI Transfer", 
        subtitle: "Instant transfer", 
        icon: "SiGooglepay", 
        fee: "₹0", 
        time: "Instant" 
      },
      { 
        id: 4, 
        name: "PayPal", 
        subtitle: "International withdrawal", 
        icon: "FaPaypal", 
        fee: "3%", 
        time: "1-2 days" 
      },
      { 
        id: 5, 
        name: "Wise Transfer", 
        subtitle: "Low fees", 
        icon: "SiWise", 
        fee: "0.5%", 
        time: "1 day" 
      },
    ]
  },
  
  transactions: [
    { 
      id: 1, 
      type: "credit", 
      method: "Razorpay", 
      amount: 5000, 
      date: "2025-10-31T14:30:00", 
      status: "success",
      description: "Added via UPI"
    },
    { 
      id: 2, 
      type: "debit", 
      method: "UPI Transfer", 
      amount: 2500, 
      date: "2025-10-30T10:15:00", 
      status: "success",
      description: "Withdrawn to bank"
    },
    { 
      id: 3, 
      type: "credit", 
      method: "Cryptomus", 
      amount: 10000, 
      date: "2025-10-29T16:45:00", 
      status: "success",
      description: "BTC payment"
    },
    { 
      id: 4, 
      type: "debit", 
      method: "PayPal", 
      amount: 3000, 
      date: "2025-10-28T09:20:00", 
      status: "pending",
      description: "International withdrawal"
    },
    { 
      id: 5, 
      type: "credit", 
      method: "Bank Transfer", 
      amount: 8500, 
      date: "2025-10-27T11:00:00", 
      status: "success",
      description: "Direct deposit"
    },
    { 
      id: 6, 
      type: "debit", 
      method: "Cryptocurrency", 
      amount: 5000, 
      date: "2025-10-26T16:20:00", 
      status: "success",
      description: "Withdrawn to BTC wallet"
    },
    { 
      id: 7, 
      type: "credit", 
      method: "Wise", 
      amount: 12000, 
      date: "2025-10-25T09:45:00", 
      status: "success",
      description: "International transfer"
    },
    { 
      id: 8, 
      type: "debit", 
      method: "UPI Transfer", 
      amount: 1500, 
      date: "2025-10-24T14:10:00", 
      status: "success",
      description: "Withdrawn via UPI"
    },
    { 
      id: 9, 
      type: "credit", 
      method: "Razorpay", 
      amount: 7500, 
      date: "2025-10-23T10:30:00", 
      status: "success",
      description: "Added via Netbanking"
    },
    { 
      id: 10, 
      type: "debit", 
      method: "Bank Transfer", 
      amount: 4000, 
      date: "2025-10-22T15:50:00", 
      status: "failed",
      description: "Withdrawal failed"
    },
    { 
      id: 11, 
      type: "credit", 
      method: "PayPal", 
      amount: 6000, 
      date: "2025-10-21T12:15:00", 
      status: "success",
      description: "International payment received"
    },
    { 
      id: 12, 
      type: "debit", 
      method: "Wise Transfer", 
      amount: 3500, 
      date: "2025-10-20T08:40:00", 
      status: "success",
      description: "Withdrawn via Wise"
    },
  ]
};
