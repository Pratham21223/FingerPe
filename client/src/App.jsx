import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WalletPage from './components/WalletPage';
import WalletManagementPage from './components/WalletManagementPage';
import './styles/globals.css';
import React from "react";
import TransactionDashboard from './components/TransactionDashboard';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
// Remove the glassmorphism.css import

function App() {
  return (
  <Router>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/dashboard" element={<WalletPage />} />
    <Route path="/wallet" element={<WalletManagementPage />} />
    <Route path="/summary" element={<TransactionDashboard />} />
  </Routes>
  </Router>
  );
}

export default App;

