import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiDollarSign, FiDownload, FiUpload, FiUserPlus, FiClock } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const iconMap = {
  bet: FiDollarSign,
  withdrawal: FiUpload,
  deposit: FiDownload,
  connection: FiUserPlus,
  wallet: FiUserPlus,
};

const colorMap = {
  bet: 'text-yellow-400',
  withdrawal: 'text-red-400',
  deposit: 'text-green-400',
  connection: 'text-purple-400',
  wallet: 'text-purple-400',
};

export default function RecentActivity() {
  const { publicKey } = useWallet();
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const LIMIT = 5;

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const loadActivities = async (pageNum) => {
    if (!publicKey) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${publicKey.toString()}/activities?page=${pageNum}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const { activities: newActs, hasMore } = await res.json();
      setActivities(newActs);
      setHasMore(hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) loadActivities(1);
  }, [publicKey]);

  return (
    <Layout>
      <section className="min-h-screen py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl h-24 font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Activity Log
            </h1>
            <p className="text-gray-400 -mt-4">All platform interactions in real-time</p>
          </motion.div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            {activities.map((activity, idx) => {
              const Icon = iconMap[activity.type] || FiClock;
              const color = colorMap[activity.type] || 'text-gray-400';
              return (
                <motion.div
                  key={`${activity.timestamp}-${idx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 mb-4 bg-gray-700/10 rounded-xl hover:bg-gray-700/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Icon className={`w-8 h-8 ${color}`} />
                      <div>
                        <h3 className="text-white font-medium">{activity.title}</h3>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <FiClock className="w-4 h-4" />
                          <span>
                            {new Date(activity.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className={`${color} font-mono`}>{activity.amount}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {loading && activities.length === 0 && (
              <div className="text-center text-gray-400 py-8 flex items-center justify-center">
                <Spinner />
                <span className="ml-2">Loading activities...</span>
              </div>
            )}

            {!loading && activities.length === 0 && (
              <div className="text-center text-gray-400 py-8">No activities found</div>
            )}

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => loadActivities(page - 1)}
                disabled={loading || page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 flex items-center gap-2"
              >
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Page {page}</span>
              </div>

              <button
                onClick={() => loadActivities(page + 1)}
                disabled={!hasMore}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 flex items-center gap-2"
              >
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}