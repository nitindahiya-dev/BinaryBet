// frontend/pages/betting.jsx
import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import Layout from '../components/Layout';

const Betting = () => {
  const [currentNumber, setCurrentNumber] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [betChoice, setBetChoice] = useState('');
  const [isWin, setIsWin] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const generateNumber = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  const placeBet = (choice) => {
    const newNumber = generateNumber();
    const isEven = newNumber % 2 === 0;
    const won = (choice === 'even' && isEven) || (choice === 'odd' && !isEven);

    setCurrentNumber(newNumber);
    setBetChoice(choice);
    setIsWin(won);
    setResultMessage(won ? 'Congratulations! You Won!' : 'Better Luck Next Time!');
    setShowResultModal(true);
  };

  const resetGame = () => {
    setCurrentNumber(null);
    setShowResultModal(false);
    setBetChoice('');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          {/* Betting Interface */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Even/Odd Predictor
            </h1>

            {/* Number Display */}
            <div className="mb-8 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-700/30 flex items-center justify-center border-4 border-cyan-500/30">
                <span className="text-4xl font-bold text-cyan-400">
                  {currentNumber || '?'}
                </span>
              </div>
            </div>

            {/* Bet Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => placeBet('even')}
                className="p-4 bg-green-500/10 hover:bg-green-500/20 rounded-xl border border-green-500/30 flex flex-col items-center justify-center transition-all"
              >
                <FiCheckCircle className="w-8 h-8 text-green-400 mb-2" />
                <span className="text-xl font-semibold text-green-400">Even</span>
              </button>

              <button
                onClick={() => placeBet('odd')}
                className="p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl border border-purple-500/30 flex flex-col items-center justify-center transition-all"
              >
                <FiXCircle className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-xl font-semibold text-purple-400">Odd</span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="w-full mt-6 p-3 bg-gray-700/30 hover:bg-cyan-500/10 rounded-lg text-cyan-400 flex items-center justify-center space-x-2 transition-colors"
            >
              <FiRefreshCw className="w-5 h-5" />
              <span>Reset Game</span>
            </button>
          </div>
        </div>

        {/* Result Modal */}
        {showResultModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border ${
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

                <h2 className={`text-2xl font-bold mb-2 ${
                  isWin ? 'text-green-400' : 'text-red-400'
                }`}>
                  {resultMessage}
                </h2>

                <div className="mb-6 text-gray-300">
                  <p className="text-lg">
                    Number was: <span className="font-bold text-cyan-400">{currentNumber}</span>
                  </p>
                  <p className="text-sm">
                    You predicted: <span className="font-bold">{betChoice}</span>
                  </p>
                </div>

                <button
                  onClick={() => setShowResultModal(false)}
                  className="w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors"
                >
                  Continue Betting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Betting;