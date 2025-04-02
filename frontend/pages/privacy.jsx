import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiLock, FiShield, FiDatabase, FiUser } from 'react-icons/fi';

const Privacy = () => {
  const sections = [
    {
      icon: FiLock,
      title: "Data Collection",
      content: "We only collect essential wallet information required for transactions. No personal data is stored."
    },
    {
      icon: FiShield,
      title: "Data Protection",
      content: "All transaction data is encrypted using military-grade encryption protocols."
    },
    {
      icon: FiDatabase,
      title: "Third-Party Sharing",
      content: "We never share or sell your data to third parties. All operations are fully decentralized."
    },
    {
      icon: FiUser,
      title: "Your Rights",
      content: "You maintain full control over your data. You can disconnect your wallet at any time."
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
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-400/30 transition-all"
              >
                <section.icon className="w-12 h-12 text-purple-400 mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">{section.title}</h3>
                <p className="text-gray-400 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;