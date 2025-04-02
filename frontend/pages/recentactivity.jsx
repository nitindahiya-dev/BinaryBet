import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiDollarSign, FiDownload, FiUpload, FiWallet, FiClock } from 'react-icons/fi';

const RecentActivity = () => {
  const activities = [
    {
      type: 'deposit',
      icon: FiDownload,
      title: "Deposit Received",
      amount: "+2.45 SOL",
      timestamp: "2024-03-20 14:30:45",
      color: "text-green-400"
    },
    {
      type: 'withdrawal',
      icon: FiUpload,
      title: "Withdrawal Processed",
      amount: "-1.20 SOL",
      timestamp: "2024-03-20 12:15:22",
      color: "text-red-400"
    },
    {
      type: 'wallet',
      icon: FiWallet,
      title: "New Wallet Connected",
      amount: "",
      timestamp: "2024-03-20 09:45:10",
      color: "text-purple-400"
    },
    {
      type: 'bet',
      icon: FiDollarSign,
      title: "Bet Placed",
      amount: "-0.50 SOL",
      timestamp: "2024-03-20 08:30:05",
      color: "text-yellow-400"
    }
  ];

  return (
    <Layout>
      <section className="min-h-screen py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Activity Log
            </h1>
            <p className="text-gray-400 mt-4">All platform interactions in real-time</p>
          </motion.div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            {activities.map((activity, idx) => {
              const Icon = activity.icon;
              console.log('Rendering activity:', activity); // Debugging line
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
                  className="p-6 mb-4 bg-gray-700/10 rounded-xl hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {Icon ? <Icon className={`w-8 h-8 ${activity.color}`} /> : null}
                      <div>
                        <h3 className="text-white font-medium">{activity.title}</h3>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <FiClock className="w-4 h-4" />
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className={`${activity.color} font-mono`}>
                        {activity.amount}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RecentActivity;