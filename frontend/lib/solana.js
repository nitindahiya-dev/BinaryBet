// frontend/lib/solana.js
import { Connection } from '@solana/web3.js';

const network = 'https://api.devnet.solana.com';
export const connection = new Connection(network);

export async function connectPhantomWallet() {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response = await window.solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      return response.publicKey.toString();
    } catch (err) {
      console.error('Phantom connection error:', err);
    }
  } else {
    alert('Phantom Wallet not found. Please install it from https://phantom.app/');
  }
}

export async function getWalletAddress() {
  if (window.solana && window.solana.isPhantom) {
    return window.solana.publicKey ? window.solana.publicKey.toString() : '';
  }
  return '';
}
