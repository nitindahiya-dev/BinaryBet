import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiAlertTriangle, FiDollarSign, FiActivity, FiUserX } from 'react-icons/fi';

const Responsibility = () => {
  const points = [
    {
      icon: FiAlertTriangle,
      title: "Risk Acknowledgement",
      content: "Cryptocurrency investments carry inherent risks. Only invest what you can afford to lose."
    },
    {
      icon: FiDollarSign,
      title: "Financial Responsibility",
      content: "You are solely responsible for your financial decisions and tax obligations."
    },
    {
      icon: FiActivity,
      title: "Market Volatility",
      content: "We are not responsible for losses due to market fluctuations or technical issues."
    },
    {
      icon: FiUserX,
      title: "Account Security",
      content: "You must maintain security of your credentials. We cannot recover lost funds."
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
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              User Responsibility
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {points.map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-red-400/30 transition-all"
              >
                <point.icon className="w-12 h-12 text-red-400 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">{point.title}</h3>
                <p className="text-gray-400 leading-relaxed">{point.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Responsibility;