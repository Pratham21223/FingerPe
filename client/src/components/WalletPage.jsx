import { useState, useEffect } from 'react';
import ParticleBackground from './ParticleBackground';
import HeroSection from './HeroSection';
import SendReceiveButtons from './SendReceiveButtons';
import OffersBanner from './OffersBanner';
import RewardsSection from './RewardsSection';
import ReferralCard from './ReferralCard';
import RecentMerchants from './RecentMerchants';
import ServiceGrid from './ServiceGrid';
import VoiceModal from './VoiceModal';
import QRScanner from './QRScanner';
import UPIPaymentConfirm from './UPIPaymentConfirm';
import BiometricAuth from './BiometricAuth';
import PaymentSuccess from './PaymentSuccess';
import { walletData } from '../utils/dummyData';

const WalletPage = () => {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannedUPI, setScannedUPI] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  // Log state changes
  useEffect(() => {
    console.log('📊 State update:');
    console.log('  showBiometric:', showBiometric);
    console.log('  showSuccess:', showSuccess);
    console.log('  paymentData:', paymentData);
  }, [showBiometric, showSuccess, paymentData]);

  // Handle voice command to scan QR
  const handleVoiceScanQR = () => {
    console.log('🔍 Voice: Opening QR Scanner');
    setShowQRScanner(true);
  };

  // Handle voice command to pay contact
  const handleVoicePayContact = (contactData) => {
    console.log('👤 Voice: Pay to contact', contactData);
    setScannedUPI(contactData.upiCode);
    setShowPaymentConfirm(true);
  };

  // Handle QR scan from scanner
  const handleQRScan = (data) => {
    console.log('📱 QR Code Data:', data);
    setScannedUPI(data);
    setShowQRScanner(false);
    setTimeout(() => {
      setShowPaymentConfirm(true);
    }, 300);
  };

  // Handle payment confirmation
  const handlePaymentConfirm = (data) => {
    console.log('✅ Payment Confirmed:', data);
    setPaymentData(data);
    setShowPaymentConfirm(false);
    
    setTimeout(() => {
      console.log('🔐 Opening Biometric Modal');
      setShowBiometric(true);
    }, 300);
  };

  // Handle biometric success
 const handleBiometricSuccess = (transferResult) => {
  console.log('🎉 Biometric Success! Result:', transferResult);
  setShowBiometric(false);
  
  setTimeout(() => {
    // Merge transferResult with existing paymentData
    const mergedData = { 
      ...paymentData,  // Keep name, amount, phoneNumber
      ...transferResult,  // Add transaction ID and other biometric data
      transactionId: transferResult?.transactionId || `TXN-${Date.now()}`
    };
    
    console.log('💳 Setting payment data:', mergedData);
    setPaymentData(mergedData);
    
    setTimeout(() => {
      console.log('🎊 Opening success modal');
      setShowSuccess(true);
    }, 300);
  }, 500);
};


  // Handle success modal close
  const handleSuccessClose = () => {
    console.log('❌ Closing success modal');
    setShowSuccess(false);
    setPaymentData(null);
    setScannedUPI(null);
  };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-md mx-auto p-4 pb-8">
        <SendReceiveButtons 
          onReceiveClick={() => {}}
          onUpiIdClick={() => setShowVoiceModal(true)}
          onScanQR={() => setShowQRScanner(true)}
        />
        <HeroSection balance={walletData.balance} />
        <OffersBanner offers={walletData.offers} />
        <RewardsSection rewards={walletData.rewards} />
        <ReferralCard referralCode={walletData.referralCode} />
        <RecentMerchants merchants={walletData.recentMerchants} />
        <ServiceGrid services={walletData.services} />
      </div>

      {/* Voice Modal */}
      <VoiceModal 
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onScanQR={handleVoiceScanQR}
        onPayContact={handleVoicePayContact}
        autoStart={true}
      />

      {/* QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />

      {/* Payment Confirmation */}
      {scannedUPI && (
        <UPIPaymentConfirm
          isOpen={showPaymentConfirm}
          onClose={() => {
            setShowPaymentConfirm(false);
            setScannedUPI(null);
          }}
          upiName={scannedUPI.split('pn=')[1]?.split('&')[0]?.replace(/%20/g, ' ') || 'Unknown'}
          upiCode={scannedUPI}
          onConfirm={handlePaymentConfirm}
        />
      )}

      {/* Biometric Authentication */}
      <BiometricAuth
        isOpen={showBiometric}
        onClose={() => {
          console.log('🔓 Closing biometric modal without success');
          setShowBiometric(false);
        }}
        onSuccess={handleBiometricSuccess}
        paymentData={paymentData}
      />

      {/* Payment Success */}
      <PaymentSuccess
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        paymentData={paymentData}
      />
    </div>
  );
};

export default WalletPage;
