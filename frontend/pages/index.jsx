import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTheme } from 'next-themes';
import {
  FiArrowRight, FiDollarSign, FiTrendingUp, FiUsers,
  FiCheck, FiClock, FiBarChart2, FiSun, FiMoon,
  FiChevronRight, FiHelpCircle, FiAlertTriangle, FiList
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { WalletNotSelectedError } from '@solana/wallet-adapter-base';


const Home = () => {
  const { connected, connect } = useWallet();
  const { theme, setTheme } = useTheme();
  const [counters, setCounters] = useState({ users: 0, matches: 0, bets: 0 });
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ data
  const faqItems = [
    {
      question: "How do I start betting?",
      answer: "Connect your wallet, choose a match, select even/odd, and confirm your bet. Winnings are paid instantly!",
    },
    {
      question: "Is betting provably fair?",
      answer: "Yes! All outcomes are determined by on-chain verifiable random functions.",
    },
    {
      question: "What are the fees?",
      answer: "We charge a 2% platform fee on winning bets. No fees for losing bets.",
    },
    {
      question: "How are payouts calculated?",
      answer: "Payouts are based on real-time odds. Even/odd bets typically pay 1.95x your wager.",
    }
  ];

  // Rules list
  const rules = [
    "Must be 18+ to participate",
    "Minimum bet: 0.000001 SOL",
    "Maximum bet: 1 SOL",
    "Bets are final once confirmed",
    "Results determined by verifiable RNG",
    "Winnings paid instantly after match"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        users: Math.min(prev.users + 47, 10000),
        matches: Math.min(prev.matches + 23, 5000),
        bets: Math.min(prev.bets + 189, 25000)
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-8">
              Decentralized <br />Sports Betting
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Experience provably fair predictions with instant settlements. Powered by Solana blockchain technology.
            </p>

          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-24">
            {[
              { icon: FiUsers, value: counters.users, label: 'Active Traders' },
              { icon: FiTrendingUp, value: counters.matches, label: 'Daily Matches' },
              { icon: FiDollarSign, value: counters.bets, label: 'Total Volume' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-teal-400/30 transition-colors"
              >
                <item.icon className="w-12 h-12 text-teal-400 mx-auto mb-4 p-3 bg-gray-700/30 rounded-lg" />
                <div className="text-4xl font-bold text-teal-400 mb-2">
                  {item.value.toLocaleString()}+
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="fixed bottom-8 right-8 p-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-teal-400/30 transition-colors"
        >
          {theme === 'dark' ? (
            <FiSun className="w-6 h-6 text-teal-400" />
          ) : (
            <FiMoon className="w-6 h-6 text-teal-400" />
          )}
        </button>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Simple & Transparent
            </h2>
            <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto">
              Four easy steps to start predicting and winning
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: FiUsers,
                title: "1. Connect Wallet",
                desc: "Secure integration with Phantom Wallet",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: FiTrendingUp,
                title: "2. Choose Match",
                desc: "Select from live or upcoming games",
                color: "from-cyan-500 to-blue-500"
              },
              {
                icon: FiDollarSign,
                title: "3. Place Bet",
                desc: "Predict even/odd with real-time odds",
                color: "from-green-500 to-cyan-500"
              },
              {
                icon: FiCheck,
                title: "4. Get Paid",
                desc: "Instant SOL payouts after match ends",
                color: "from-orange-500 to-red-500"
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-teal-400/30 transition-all"
              >
                <div className={`mb-6 w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Bet & Rules Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* How to Bet */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20"
            >
              <div className="flex items-center mb-6">
                <FiList className="w-8 h-8 text-cyan-400 mr-4" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  How to Bet
                </h2>
              </div>
              <div className="space-y-6">
                {[
                  { icon: FiCheck, text: "Connect your crypto wallet" },
                  { icon: FiClock, text: "Select live or upcoming match" },
                  { icon: FiTrendingUp, text: "Choose even or odd prediction" },
                  { icon: FiDollarSign, text: "Confirm bet amount and submit" }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <step.icon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <p className="text-gray-300">{step.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20"
            >
              <div className="flex items-center mb-6">
                <FiAlertTriangle className="w-8 h-8 text-red-400 mr-4" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                  Important Rules
                </h2>
              </div>
              <ul className="grid grid-cols-1 gap-4">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300">{rule}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20"
          >
            <div className="flex items-center mb-6">
              <FiHelpCircle className="w-8 h-8 text-purple-400 mr-4" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-700/50 last:border-0"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center py-4 hover:text-cyan-400 transition-colors"
                  >
                    <span className="text-left text-gray-300">{item.question}</span>
                    <FiChevronRight className={`transform transition-transform ${openFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: openFaq === idx ? 1 : 0,
                      height: openFaq === idx ? 'auto' : 0
                    }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-gray-400">{item.answer}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;