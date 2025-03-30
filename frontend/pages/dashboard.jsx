// frontend/pages/dashboard.jsx
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  FiActivity, FiDollarSign, FiTrendingUp, FiAlertCircle, FiClock, FiLogOut
} from 'react-icons/fi';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { connected, publicKey } = useWallet();
  const [userStats, setUserStats] = useState(null);
  const [betHistory, setBetHistory] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('SOL');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (connected && publicKey) {
      const wallet = publicKey.toString();

      // Fetch user details (including stats)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${encodeURIComponent(wallet)}`)
        .then(response => response.json())
        .then(data => {
          console.log('User details:', data);
          setUserStats(data.stats);
        })
        .catch(error => console.error('Error fetching user details:', error));


      // Fetch bet history
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bets?wallet=${wallet}`)
        .then(response => response.json())
        .then(data => {
          console.log('Bet history:', data);
          setBetHistory(data.bets);
        })
        .catch(error => console.error('Error fetching bet history:', error));
    }
  }, [connected, publicKey]);


  // Withdrawal handler with UI feedback
  const handleWithdrawal = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      setNotification('');
      return;
    }

    if (userStats && amount > userStats.availableBalance) {
      setError('Amount exceeds available balance');
      setNotification('');
      return;
    }

    // Simulate a successful withdrawal (update with real logic)
    setNotification(`Withdrawal request for ${amount} ${selectedCurrency} submitted successfully.`);
    setError('');
    setWithdrawAmount('');
  };

  const username = publicKey ? ` _${publicKey.toString().slice(0, 4)}` : 'Anonymous';
  const avatarUrl = publicKey
    ? `https://api.dicebear.com/6.x/identicon/svg?seed=${publicKey.toString()}`
    : `https://api.dicebear.com/6.x/identicon/svg?seed=anonymous`;

  if (!connected) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center max-w-2xl">
            <FiAlertCircle className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-100 mb-4">Wallet Not Connected</h1>
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
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-gray-100">{username}</h2>
                <p className="text-gray-400 mt-1">
                  Solana Wallet Address: {publicKey ? `${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}` : 'Anonymous'}
                </p>
              </div>
            </div>

            {/* Withdrawal Form */}
            <div className="w-full md:w-auto mt-6 md:mt-0">
              <form onSubmit={handleWithdrawal} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Amount"
                    className="bg-gray-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/20 text-gray-100 focus:outline-none focus:border-cyan-400"
                    step="0.01"
                  />
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="bg-gray-700/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-500/20 text-gray-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Available: {userStats ? userStats.availableBalance.toFixed(2) : '0.00'} SOL</p>
                  <p>Network Fee: 0.001 SOL</p>
                  {withdrawAmount && (
                    <p>You'll receive: {(parseFloat(withdrawAmount) - 0.001).toFixed(2)} SOL</p>
                  )}
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {notification && <p className="text-green-400 text-sm">{notification}</p>}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600/30 hover:bg-cyan-600/40 rounded-lg text-cyan-400 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  Withdraw Funds
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiActivity className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{userStats ? userStats.totalBets : 0}</h3>
              <p className="text-gray-400">Total Bets</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiTrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{userStats ? userStats.totalWins : 0}</h3>
              <p className="text-gray-400">Total Wins</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiAlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{userStats ? userStats.totalLosses : 0}</h3>
              <p className="text-gray-400">Total Losses</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiDollarSign className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">
                {userStats ? userStats.winRate.toFixed(2) : 0}%
              </h3>
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
                        {bet.betChoice}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bet.outcome === 'Win'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                        }`}>
                        {bet.outcome}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{bet.result} SOL</td>
                    <td className="px-6 py-4 text-gray-400">
                      <FiClock className="inline-block w-4 h-4 mr-2" />
                      {new Date(bet.timestamp).toLocaleString()}
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
