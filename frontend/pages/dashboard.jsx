import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  FiActivity,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiClock,
  FiLogOut,
  FiTrash2,
} from 'react-icons/fi';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { publicKey } = useWallet();
  const [userStats, setUserStats] = useState(null);
  const [betHistory, setBetHistory] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('SOL');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingBets, setLoadingBets] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(betHistory.length / ITEMS_PER_PAGE);
  // IMPORTANT: Use ONLY the environment variable. Do not fall back to localhost.
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchUserStats = useCallback(async () => {
    if (!publicKey) return;
    setLoadingStats(true);
    setError('');
    try {
      const wallet = encodeURIComponent(publicKey.toString());
      console.log('Fetching user stats for wallet:', wallet);
      const res = await fetch(`${BACKEND}/api/users/${wallet}`);
      const data = await res.json();

      if (res.status === 404) {
        setError('Profile not found. Please sign up.');
        window.location.href = '/';
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to fetch user details');

      setUserStats(data.stats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  }, [publicKey, BACKEND]);

  const fetchBetHistory = useCallback(async () => {
    if (!publicKey) return;
    setLoadingBets(true);
    setError('');
    try {
      const wallet = encodeURIComponent(publicKey.toString());
      console.log('Fetching bet history for wallet:', wallet);
      const res = await fetch(`${BACKEND}/api/bets?wallet=${wallet}`);
      const data = await res.json();

      if (res.status === 404) {
        setError('Profile not found. Please sign up.');
        window.location.href = '/';
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Failed to fetch bet history');

      setBetHistory(data.bets || []);
    } catch (err) {
      console.error('Error fetching bet history:', err);
      setError(err.message);
    } finally {
      setLoadingBets(false);
    }
  }, [publicKey, BACKEND]);

  useEffect(() => {
    if (publicKey) {
      console.log('Public key available, fetching data...');
      fetchUserStats();
      fetchBetHistory();
    }
  }, [publicKey, fetchUserStats, fetchBetHistory]);

  useEffect(() => {
    if (publicKey) {
      const iv = setInterval(fetchUserStats, 100000);
      return () => clearInterval(iv);
    }
  }, [publicKey, fetchUserStats]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    if (!userStats) return;
    const amount = parseFloat(withdrawAmount);
    const fee = 0.001;
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (amount + fee > userStats.availableBalance) {
      setError('Amount plus network fee exceeds available balance');
      return;
    }
    try {
      const wallet = publicKey.toString();
      const res = await fetch(`${BACKEND}/api/withdrawals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, amount, currency: selectedCurrency }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Withdrawal failed');
      setNotification(`Withdrawal of ${amount} ${selectedCurrency} submitted.`);
      setError('');
      setWithdrawAmount('');
      if (data.updatedBalance !== undefined) {
        setUserStats(prev => ({ ...prev, availableBalance: data.updatedBalance }));
      } else {
        fetchUserStats();
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setNotification('');
    }
  };

  // New: Function to delete user profile
  const handleDeleteProfile = async () => {
    if (!publicKey) return;
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
    try {
      const wallet = encodeURIComponent(publicKey.toString());
      const res = await fetch(`${BACKEND}/api/users/${wallet}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete profile');
      setNotification('Profile deleted successfully. Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      console.error('Error deleting profile:', err);
      setNotification(`Error deleting profile: ${err.message}`);
    }
  };

  const paginatedBets = betHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const username = publicKey ? `_${publicKey.toString().slice(0, 6)}` : 'Anonymous';
  const avatarUrl = publicKey
    ? `https://api.dicebear.com/6.x/identicon/svg?seed=${publicKey.toString()}`
    : `https://api.dicebear.com/6.x/identicon/svg?seed=anonymous`;

  if (!publicKey) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center flex-col bg-gray-900">
          <FiAlertCircle className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-100 mb-4">Wallet Not Connected</h1>
          <p className="text-gray-400 mb-8">Please connect your wallet to view your dashboard.</p>
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <p className="text-red-400">{error}</p>
        </div>
      </Layout>
    );
  }
  if (loadingStats || loadingBets) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </Layout>
    );
  }
  if (!userStats) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <p className="text-gray-400">No user stats available.</p>
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
                  {publicKey
                    ? `${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`
                    : 'Anonymous'}
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <form onSubmit={handleWithdrawal} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    placeholder="Amount"
                    step="0.01"
                    className="bg-gray-700/30 px-4 py-2 rounded-lg border border-cyan-500/20 text-gray-100"
                  />
                  <select
                    value={selectedCurrency}
                    onChange={e => setSelectedCurrency(e.target.value)}
                    className="bg-gray-700/30 px-4 py-2 rounded-lg border border-cyan-500/20 text-gray-100"
                  >
                    <option>SOL</option>
                    <option>USDC</option>
                  </select>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Available: {Math.max(0, userStats.availableBalance).toFixed(2)} SOL</p>
                  <p>Network Fee: 0.001 SOL</p>
                  {withdrawAmount && (
                    <p>You'll receive: {(parseFloat(withdrawAmount) - 0.001).toFixed(2)} SOL</p>
                  )}
                </div>
                {notification && <p className="text-green-400 text-sm">{notification}</p>}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600/30 hover:bg-cyan-600/40 rounded-lg text-cyan-400"
                >
                  <FiLogOut className="w-5 h-5" />
                  Withdraw Funds
                </button>
              </form>
              {/* Delete Profile Button */}
              <button
                onClick={handleDeleteProfile}
                className="flex items-center md:mt-[115px] justify-center gap-2 px-6 py-3 bg-red-600/30 hover:bg-red-600/40 rounded-lg text-red-400"
              >
                <FiTrash2 className="w-5 h-5" />
                Delete Profile
              </button>
            </div>
          </div>
        </div>
        {/* Stats Overview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiActivity className="w-8 h-8 text-cyan-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{userStats.totalBets}</h3>
              <p className="text-gray-400">Total Bets</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiTrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{userStats.totalWins}</h3>
              <p className="text-gray-400">Total Wins</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiAlertCircle className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{userStats.totalLosses}</h3>
              <p className="text-gray-400">Total Losses</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20">
              <FiDollarSign className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-2xl font-bold text-gray-100">{userStats.winRate.toFixed(2)}%</h3>
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
                {paginatedBets.map((bet) => (
                  <tr key={bet.id} className="hover:bg-gray-700/10 transition-colors">
                    <td className="px-6 md:py-4 text-gray-300">{bet.amount} SOL</td>
                    <td className="px-6 md:py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400">
                        {bet.betChoice}
                      </span>
                    </td>
                    <td className="px-6 md:py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bet.outcome === 'Win'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {bet.outcome}
                      </span>
                    </td>
                    <td className="px-6 md:py-4 text-gray-300">{bet.result} SOL</td>
                    <td className="px-6 py-4 text-gray-400">
                      <FiClock className="inline-block w-4 h-4 mr-2" />
                      {new Date(bet.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 hover:shadow-lg hover:shadow-cyan-500/20'
                  }`}
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                          : 'bg-gray-700/30 text-gray-300 hover:bg-cyan-600/20 hover:text-cyan-400'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 hover:shadow-lg hover:shadow-cyan-500/20'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
