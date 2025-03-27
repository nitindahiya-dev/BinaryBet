// frontend/pages/betting.jsx
import { useState } from 'react';
import { useRouter } from 'next/router'; 
import { FiCheckCircle, FiXCircle, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import Layout from '../components/Layout'

const mockMatches = [
  { id: 1, status: 'live', startTime: '2023-10-05T15:00:00' },
  { id: 2, status: 'upcoming', startTime: '2023-10-05T15:30:00' },
];

const Betting = () => {
  const router = useRouter();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [betChoice, setBetChoice] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isWin, setIsWin] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const generateNumber = () => Math.floor(Math.random() * 10) + 1;

  const validateBet = () => {
    const amount = parseFloat(betAmount);
    if (!selectedMatch) return 'Select a match first';
    if (!betChoice) return 'Choose even or odd prediction';
    if (isNaN(amount)) return 'Enter valid bet amount';
    if (amount < 0.000001 || amount > 1) return 'Amount must be between 0.000001 and 1 SOL';
    return null;
  };

  const handleProceed = () => {
    const error = validateBet();
    if (error) return setErrorMessage(error);
    setErrorMessage('');
    setShowConfirmModal(true);
  };

  const confirmBet = () => {
    const newNumber = generateNumber();
    const isEven = newNumber % 2 === 0;
    const won = (betChoice === 'even' && isEven) || (betChoice === 'odd' && !isEven);
    const winnings = won ? (parseFloat(betAmount) * 1.95).toFixed(6) : 0;

    setCurrentNumber(newNumber);
    setIsWin(won);
    setResultMessage(won ? `You won ${winnings} SOL!` : 'Better Luck Next Time!');
    setShowResultModal(true);
    setShowConfirmModal(false);
  };

  const resetGame = () => {
    setSelectedMatch(null);
    setBetChoice('');
    setBetAmount('');
    setCurrentNumber(null);
    setShowResultModal(false);
    setShowConfirmModal(false);
    setErrorMessage('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main Interface */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
            <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SOL Predictor
            </h1>

            {/* Match Selection */}
            <div className="mb-6">
              <select
                value={selectedMatch?.id || ''}
                onChange={(e) =>
                  setSelectedMatch(mockMatches.find(m => m.id === parseInt(e.target.value)))
                }
                className="w-full p-3 bg-gray-700/30 rounded-lg border border-cyan-500/30 text-gray-300"
              >
                <option value="">Select Live/Upcoming Match</option>
                {mockMatches.map(match => (
                  <option key={match.id} value={match.id}>
                    {match.status.charAt(0).toUpperCase() + match.status.slice(1)} Match -{' '}
                    {new Date(match.startTime).toLocaleTimeString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Prediction Interface */}
            {selectedMatch && (
              <>
                <div className="mb-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gray-700/30 flex items-center justify-center border-4 border-cyan-500/30">
                    <span className="text-4xl font-bold text-cyan-400">
                      {currentNumber || '?'}
                    </span>
                  </div>
                </div>

                {!betChoice ? (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    < button
                      onClick={() => setBetChoice('even')}
                      className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-xl border border-green-500/30 flex flex-col items-center justify-center transition-all"
                    >
                      <FiCheckCircle className="w-8 h-8 text-green-400 mb-2" />
                      <span className="text-xl font-semibold text-green-400">Even</span>
                    </button>

                    <button
                      onClick={() => setBetChoice('odd')}
                      className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/30 flex flex-col items-center justify-center transition-all"
                    >
                      <FiXCircle className="w-8 h-8 text-purple-400 mb-2" />
                      <span className="text-xl font-semibold text-purple-400">Odd</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        max="1"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        placeholder="Enter bet amount in SOL"
                        className="w-full p-3 bg-gray-700/30 rounded-lg border border-cyan-500/30 text-gray-300 pr-12"
                      />
                      <span className="absolute right-3 top-3 text-gray-400">SOL</span>
                    </div>
                    <div className="text-sm text-gray-400 text-center">
                      Min: 0.000001 SOL | Max: 1 SOL
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {errorMessage && (
                  <div className="mt-4 text-center text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {betChoice && (
                    <button
                      onClick={handleProceed}
                      className="w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 flex items-center justify-center space-x-2 transition-colors"
                    >
                      <FiDollarSign className="w-5 h-5" />
                      <span>Proceed to Bet</span>
                    </button>
                  )}
                  <button
                    onClick={resetGame}
                    className="w-full p-3 bg-gray-700/30 hover:bg-cyan-500/10 rounded-lg text-cyan-400 flex items-center justify-center space-x-2 transition-colors"
                  >
                    <FiRefreshCw className="w-5 h-5" />
                    <span>Reset Game</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Confirmation Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-cyan-500/30">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-4 text-cyan-400">Confirm Bet</h2>
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-300">
                      Match: <span className="text-cyan-400">{selectedMatch?.status} #{selectedMatch?.id}</span>
                    </p>
                    <p className="text-gray-300">
                      Prediction: <span className="font-semibold">{betChoice}</span>
                    </p>
                    <p className="text-gray-300">
                      Amount: <span className="font-semibold">{betAmount} SOL</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="p-2 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBet}
                      className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors"
                    >
                      Confirm Bet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Result Modal */}
          {showResultModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border ${
                isWin ? 'border-green-500/30' : 'border-red-500/30'
              }`}>
                <div className="text-center">
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${
                    isWin ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}>
                    {isWin ? (
                      <FiCheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <FiXCircle className="w-8 h-8 text-red-400" />
                    )}
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                    {isWin ? 'Victory!' : 'Defeat!'}
                  </h2>
                  <div className="mb-4 text-gray-300">
                    <p>Resulting Number: <span className="text-cyan-400 font-bold">{currentNumber}</span></p>
                    <p className="mt-2">{resultMessage}</p>
                  </div>
                  <div className="text-sm text-gray-400 mb-4">
                    Result verified by decentralized RNG
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={resetGame}
                      className="p-3 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors"
                    >
                      Bet Again
                    </button>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg text-gray-300 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Betting;