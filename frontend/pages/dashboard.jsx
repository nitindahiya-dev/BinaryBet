// frontend/pages/dashboard.jsx
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { FiActivity, FiDollarSign, FiTrendingUp, FiAlertCircle, FiClock } from 'react-icons/fi';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { connected, publicKey } = useWallet();
  const [userStats, setUserStats] = useState(null);
  const [betHistory, setBetHistory] = useState([]);

  // Mock data - replace with actual API calls
  const mockStats = {
    totalBets: 42,
    totalWins: 28,
    totalLosses: 14,
    totalWagered: 18.5,
    winRate: 66.67,
  };

  const mockBetHistory = [
    { id: 1, amount: 1.5, prediction: 'Even', outcome: 'Win', result: 3.0, timestamp: '2024-03-20 14:30' },
    { id: 2, amount: 2.0, prediction: 'Odd', outcome: 'Loss', result: 0.0, timestamp: '2024-03-20 13:45' },
    // Add more mock data...
  ];

  useEffect(() => {
    if (connected && publicKey) {
      // TODO: Fetch actual user data from API
      setUserStats(mockStats);
      setBetHistory(mockBetHistory);
    }
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center max-w-2xl">
            <FiAlertCircle className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-100 mb-4">
              Wallet Not Connected
            </h1>
            <p className="text-gray-400 mb-8">
              Please connect your wallet to view your betting dashboard and access all features.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900">
        {/* User Profile Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-100">
                  {publicKey ? `${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}` : 'Anonymous'}
                </h2>
                <p className="text-gray-400 mt-1">Solana Wallet Address</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-gray-400">Account Balance</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {mockStats.totalWagered.toFixed(2)} SOL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiActivity className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{mockStats.totalBets}</h3>
              <p className="text-gray-400">Total Bets</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiTrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{mockStats.totalWins}</h3>
              <p className="text-gray-400">Total Wins</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiAlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{mockStats.totalLosses}</h3>
              <p className="text-gray-400">Total Losses</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiDollarSign className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{mockStats.winRate}%</h3>
              <p className="text-gray-400">Win Rate</p>
            </div>
          </div>
        </div>

        {/* Bet History Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-700/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Prediction</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Outcome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Result</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {betHistory.map((bet) => (
                  <tr key={bet.id} className="hover:bg-gray-700/10 transition-colors">
                    <td className="px-6 py-4 text-gray-300">{bet.amount} SOL</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400">
                        {bet.prediction}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bet.outcome === 'Win' 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {bet.outcome}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{bet.result} SOL</td>
                    <td className="px-6 py-4 text-gray-400">
                      <FiClock className="inline-block w-4 h-4 mr-2" />
                      {bet.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;