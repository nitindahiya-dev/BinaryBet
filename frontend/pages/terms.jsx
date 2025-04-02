import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiBook, FiAlertTriangle, FiLock, FiShield } from 'react-icons/fi';

const Terms = () => {
  const terms = [
    {
      icon: FiBook,
      title: "Acceptance of Terms",
      content: "By accessing our platform, you agree to be bound by these terms and all applicable laws."
    },
    {
      icon: FiAlertTriangle,
      title: "Eligibility",
      content: "You must be at least 18 years old to use our services. Cryptocurrency trading involves significant risk."
    },
    {
      icon: FiLock,
      title: "User Responsibilities",
      content: "You are solely responsible for maintaining the security of your wallet and private keys."
    },
    {
      icon: FiShield,
      title: "Prohibited Activities",
      content: "Any form of cheating, fraud, or market manipulation will result in immediate account termination."
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
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {terms.map((term, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-teal-400/30 transition-all"
              >
                <term.icon className="w-12 h-12 text-teal-400 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">{term.title}</h3>
                <p className="text-gray-400 leading-relaxed">{term.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;