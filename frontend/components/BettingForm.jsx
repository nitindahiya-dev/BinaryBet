// frontend/components/BettingForm.js
import { useState } from 'react';

export default function BettingForm() {
  const [bet, setBet] = useState('even');

  const handleBet = (e) => {
    e.preventDefault();
    // Here you can call your backend or smart contract method
    alert(`You bet on ${bet}`);
  };

  return (
    <form onSubmit={handleBet} className="max-w-md mx-auto border p-4 rounded shadow">
      <h2 className="text-2xl mb-4">Place Your Bet</h2>
      <div className="mb-4">
        <label className="mr-2">
          <input
            type="radio"
            name="bet"
            value="even"
            checked={bet === 'even'}
            onChange={() => setBet('even')}
          />{' '}
          Even
        </label>
        <label>
          <input
            type="radio"
            name="bet"
            value="odd"
            checked={bet === 'odd'}
            onChange={() => setBet('odd')}
          />{' '}
          Odd
        </label>
      </div>
      <button type="submit" className="w-full py-2 bg-green-500 text-white rounded">
        Submit Bet
      </button>
    </form>
  );
}
