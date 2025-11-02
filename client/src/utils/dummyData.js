export const walletData = {
  balance: { 
    inr: 9109.16, 
    usd: 102.68 
  },
  rewards: { 
    points: 1250, 
    nextTier: 1500, 
    tierName: "Gold",
    currentTier: "Silver"
  },
  referralCode: "WALL3T2025",
  offers: [
    { 
      id: 1, 
      title: "Get 10% Cashback on Recharges", 
      code: "RECHARGE10",
      icon: "gift"
    },
    { 
      id: 2, 
      title: "Flat ₹50 off on Bill Payments", 
      code: "BILL50",
      icon: "percent"
    },
    { 
      id: 3, 
      title: "Win ₹1000 on First Transaction", 
      code: "FIRST1K",
      icon: "trophy"
    },
    { 
      id: 4, 
      title: "Gold Cashback: Buy Gold & Get 5% Back", 
      code: "GOLD5",
      icon: "star"
    },
    { 
      id: 5, 
      title: "Travel Special: Save 15% on Bookings", 
      code: "TRAVEL15",
      icon: "plane"
    },
  ],
  recentMerchants: [
    { id: 1, name: "Starbucks", icon: "FiCoffee", lastAmount: 450, color: "#00704A" },
    { id: 2, name: "Uber", icon: "FiNavigation", lastAmount: 280, color: "#000000" },
    { id: 3, name: "Amazon", icon: "FiShoppingBag", lastAmount: 1250, color: "#FF9900" },
    { id: 4, name: "Netflix", icon: "FiVideo", lastAmount: 649, color: "#E50914" },
    { id: 5, name: "Zomato", icon: "FiPackage", lastAmount: 320, color: "#E23744" },
    { id: 6, name: "Swiggy", icon: "FiTruck", lastAmount: 480, color: "#FC8019" },
    { id: 7, name: "BookMyShow", icon: "FiFilm", lastAmount: 600, color: "#C4242B" },
    { id: 8, name: "Myntra", icon: "FiShoppingCart", lastAmount: 2100, color: "#FF3F6C" },
  ],
  services: {
    billsRecharges: [
      { id: 1, name: "Mobile", icon: "FiSmartphone" },
      { id: 2, name: "DTH", icon: "FiMonitor" },
      { id: 3, name: "Electricity", icon: "FiZap" },
      { id: 4, name: "Water Bill", icon: "FiDroplet" },
      { id: 5, name: "Gas Bill", icon: "FiWind" },
      { id: 6, name: "Broadband", icon: "FiWifi" },
    //   { id: 7, name: "Postpaid Bill", icon: "FiPhone" },
    //   { id: 8, name: "FASTag Recharge", icon: "FiRadio" },
      { id: 9, name: "Cable TV", icon: "FiTv" },
      { id: 10, name: "Landline Bill", icon: "FiPhoneCall" },
    ],
    financial: [
      { id: 11, name: "Buy Gold", icon: "GiGoldBar" },           // Gold bar icon
      { id: 12, name: "Buy Silver", icon: "GiSilverBullet" },    // Silver icon
    //   { id: 13, name: "Mutual Funds", icon: "FiTrendingUp" },
      { id: 14, name: "Insurance", icon: "FiShield" },
      { id: 15, name: "Fixed Deposit", icon: "FiPieChart" },
      { id: 16, name: "Investment", icon: "FiBarChart2" },
      { id: 17, name: "CC Bill", icon: "FiCreditCard" },
    //   { id: 18, name: "Loan Repay", icon: "FiDollarSign" },
      { id: 19, name: "Tax Payment", icon: "FiFileText" },
      { id: 20, name: "EMI Payment", icon: "FiCalendar" },
    ],
    travel: [
      { id: 21, name: "Flight Tickets", icon: "MdFlight" },           // Airplane icon
      { id: 22, name: "Train Tickets", icon: "FaTrain" },             // Train icon
      { id: 23, name: "Bus Tickets", icon: "FaBus" },                 // Bus icon
      { id: 24, name: "Book Hotel", icon: "MdHotel" },             // Hotel icon
      { id: 25, name: "Book Cab", icon: "FaTaxi" },                // Taxi icon
      { id: 26, name: "Metro Card", icon: "FiCreditCard" },
       { id: 8, name: "Fastag", icon: "FiRadio" },
    //   { id: 27, name: "Toll", icon: "FiMapPin" },
      { id: 28, name: "Travel Insurance", icon: "MdCardTravel" },     // Travel card icon
    ],
    entertainment: [
      { id: 29, name: "Movie Tickets", icon: "FiFilm" },
      { id: 30, name: "Events", icon: "FiMusic" },
      { id: 31, name: "Subscriptions", icon: "FiVideo" },
      { id: 32, name: "App Store", icon: "IoGameController" },   // Game controller
    //   { id: 33, name: "Music Subscriptions", icon: "FiHeadphones" },
    ],
    shopping: [
      { id: 34, name: "Gift Cards", icon: "FiGift" },
      { id: 35, name: "Food Delivery", icon: "MdFastfood" },          // Food icon
      { id: 36, name: "Grocery", icon: "FaShoppingBasket" },          // Basket icon
      { id: 37, name: "Fashion", icon: "GiClothes" },        // Clothes icon
      { id: 38, name: "Electronics", icon: "FiMonitor" },
      { id: 39, name: "Pharmacy", icon: "FaHospital" },               // Medical/hospital
      { id: 40, name: "Pay Fees", icon: "FiBookOpen" },
      { id: 41, name: "Donation", icon: "FaHandHoldingHeart" }, // Charity heart
    ],
  }
};
