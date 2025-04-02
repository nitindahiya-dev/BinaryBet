import { motion } from 'framer-motion';
import { useState } from 'react';
import Layout from '../components/Layout';
import { FiHelpCircle, FiChevronRight } from 'react-icons/fi';

const FAQPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  
  const faqItems = [
    {
      question: "How do I start betting?",
      answer: "Connect your wallet, choose a match, select even/odd, and confirm your bet. Winnings are paid instantly!"
    },
    {
      question: "Is betting provably fair?",
      answer: "Yes! All outcomes are determined by on-chain verifiable random functions."
    },
    {
      question: "What are the fees?",
      answer: "We charge a 2% platform fee on winning bets. No fees for losing bets."
    },
    {
      question: "How are payouts calculated?",
      answer: "Payouts are based on real-time odds. Even/odd bets typically pay 1.95x your wager."
    }
  ];

  return (
    <Layout>
      <section className="min-h-screen py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FAQ
            </h1>
          </motion.div>

          <motion.div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center mb-6">
              <FiHelpCircle className="w-8 h-8 text-cyan-400 mr-4" />
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="border-b border-gray-700/50 last:border-0">
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

export default FAQPage;