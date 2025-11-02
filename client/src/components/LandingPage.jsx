import { Link } from 'react-router-dom';
import { Fingerprint, Mic, Shield, Zap, CheckCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Fingerprint className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                FingerPe
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { href: "#about", label: "About" },
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#pricing", label: "Pricing" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 px-2 py-1 rounded"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 px-2 py-1 rounded"
              >
                Dashboard
              </Link>
              <Link
                to="/signin"
                className="px-4 py-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/10 rounded transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="#free-trial"
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 font-semibold rounded-lg hover:from-cyan-300 hover:to-blue-400 transition duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-3">
              {[
                { href: "#about", label: "About" },
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#pricing", label: "Pricing" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="block text-gray-300 hover:text-cyan-400 transition px-2 py-1 rounded"
                >
                  {item.label}
                </a>
              ))}
              <Link to="/dashboard" className="block text-gray-300 hover:text-cyan-400 transition px-2 py-1 rounded">
                Dashboard
              </Link>
              <Link to="/signin" className="block text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/10 rounded transition px-2 py-1">
                Sign In
              </Link>
              <Link
                to="#free-trial"
                className="block px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 font-semibold rounded-lg text-center transition duration-200 hover:from-cyan-300 hover:to-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Pay with Your
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Fingerprint</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Revolutionary biometric payment system with voice command integration. 
            Just say "Pay ₹500 to Manthan" and it's done!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 font-bold rounded-lg text-lg hover:from-cyan-300 hover:to-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 transition"
            >
              Start Free Trial
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-700 hover:border-cyan-500/50 hover:scale-105 transition"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">About FingerPe</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                FingerPe revolutionizes digital payments by combining cutting-edge biometric 
                authentication with voice-activated commands. No more remembering PINs or passwords.
              </p>
              <p className="text-lg text-gray-300">
                Our advanced fingerprint recognition technology ensures maximum security while 
                providing unmatched convenience for everyday transactions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 p-6 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition">
                <Fingerprint className="w-12 h-12 mb-4 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-2">100% Secure</h3>
                <p className="text-gray-300">Biometric protection</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 p-6 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition">
                <Mic className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-2xl font-bold mb-2">Voice Control</h3>
                <p className="text-gray-300">Hands-free payments</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 transition">
                <Zap className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="text-2xl font-bold mb-2">Instant</h3>
                <p className="text-gray-300">Lightning fast</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500/20 to-cyan-500/20 border border-pink-500/30 p-6 rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 transition">
                <Shield className="w-12 h-12 mb-4 text-pink-400" />
                <h3 className="text-2xl font-bold mb-2">Protected</h3>
                <p className="text-gray-300">Bank-grade security</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Fingerprint className="w-12 h-12 text-cyan-400" />,
                title: 'Fingerprint Authentication',
                description: 'Secure biometric verification using advanced fingerprint scanning technology'
              },
              {
                icon: <Mic className="w-12 h-12 text-blue-400" />,
                title: 'Voice Commands',
                description: 'Pay anyone by simply speaking - "Pay ₹500 to Manthan" and done!'
              },
              {
                icon: <Shield className="w-12 h-12 text-purple-400" />,
                title: 'Bank-Level Security',
                description: 'Multi-layer encryption and fraud detection keeps your money safe'
              },
              {
                icon: <Zap className="w-12 h-12 text-yellow-400" />,
                title: 'Instant Transfers',
                description: 'Real-time payment processing with immediate confirmation'
              },
              {
                icon: <CheckCircle className="w-12 h-12 text-green-400" />,
                title: 'Transaction History',
                description: 'Detailed records of all your payments and activities'
              },
              {
                icon: <Shield className="w-12 h-12 text-cyan-400" />,
                title: 'Multi-Device Support',
                description: 'Use FingerPe seamlessly across all your devices'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700 p-8 rounded-xl hover:bg-gray-800 hover:border-cyan-500/50 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 transition duration-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register Your Fingerprint', description: 'Securely register your fingerprint in our encrypted system' },
              { step: '02', title: 'Link Your Account', description: 'Connect your bank account or UPI for seamless transactions' },
              { step: '03', title: 'Start Paying', description: 'Use voice commands or touch to make instant payments' }
            ].map((item, index) => (
              <div key={index} className="text-center hover:scale-105 transition">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 text-gray-900 shadow-lg shadow-cyan-500/50">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '₹0',
                features: ['5 transactions/day', 'Basic fingerprint auth', 'Email support', '1 linked account']
              },
              {
                name: 'Pro',
                price: '₹99',
                period: '/month',
                features: ['Unlimited transactions', 'Voice commands', 'Priority support', 'Multiple accounts', 'Advanced analytics'],
                featured: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Custom integration', 'Dedicated support', 'API access', 'White-label option', 'SLA guarantee']
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-gray-800/50 border rounded-xl p-8 transition ${plan.featured ? 'border-cyan-500 ring-2 ring-cyan-500/50 transform scale-105 shadow-xl shadow-cyan-500/30' : 'border-gray-700 hover:border-cyan-500/50 hover:scale-105 hover:shadow-lg'} duration-200`}>
                {plan.featured && (
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  {plan.price}
                  {plan.period && <span className="text-lg text-gray-400">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-2" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition 
                    ${plan.featured
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 hover:from-cyan-300 hover:to-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50'
                      : 'bg-gray-700 border border-gray-600 hover:bg-gray-600 hover:border-cyan-500/50 hover:scale-105'}`
                  }
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="free-trial" className="py-20 px-4 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-y border-cyan-500/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Payments?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who've already switched to fingerprint payments
          </p>
          <Link to="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r animate-bounce from-cyan-400 to-blue-500 text-gray-900 rounded-lg text-lg font-bold hover:from-cyan-300 hover:to-blue-400 transition hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50"
          >
            Start Your Free Trial Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Fingerprint className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold">FingerPe</span>
            </div>
            <p className="text-gray-400">The future of secure payments</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-cyan-400 transition">Features</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition">Pricing</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-cyan-400 transition">About</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 FingerPe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
