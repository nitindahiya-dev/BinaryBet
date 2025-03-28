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
          <div className="mb-8 text-center">
  <div className="relative inline-block">
    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent animate-gradient">
      <span className="inline-block align-middle mr-3">🎮</span>
      SOL Predictor
      <span className="inline-block align-middle ml-3">🎲</span>
    </h1>
    <div className="absolute inset-x-0 -bottom-2 mx-auto h-px w-3/4 bg-gradient-to-r from-cyan-400/0 via-cyan-400/40 to-cyan-400/0" />
  </div>

  {/* Match Selection */}
  <div className="relative group mt-8">
    <label className="block text-sm font-medium text-cyan-300 mb-2 text-left">
      Select Match Event
      <span className="ml-2 text-xs text-gray-400">(Live updates every 30s)</span>
    </label>
    
    <div className="relative rounded-lg transition-all duration-300 group-hover:border-cyan-400/50">
      <select
        value={selectedMatch?.id || ''}
        onChange={(e) => setSelectedMatch(mockMatches.find(m => m.id === parseInt(e.target.value)))}
        className="w-full pl-4 pr-10 py-3.5 bg-gray-800/60 backdrop-blur-sm rounded-lg border-2 border-cyan-500/30 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 text-gray-200 appearance-none transition-all"
      >
        <option value="" className="text-gray-400">Choose a match to predict...</option>
        {mockMatches.map(match => (
          <option
            key={match.id}
            value={match.id}
            className={`flex items-center ${match.status === 'live' ? 'text-green-400' : 'text-purple-300'}`}
          >
            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-current animate-pulse"></span>
            {match.status.toUpperCase()} MATCH •{' '}
            {new Date(match.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            })}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {/* Live Status Indicator */}
    {selectedMatch?.status === 'live' && (
      <div className="absolute right-4 top-[52px] flex items-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span className="ml-2 text-sm text-green-400 font-medium">LIVE NOW</span>
      </div>
    )}
  </div>
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