// frontend/pages/_app.js
import '../styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ThemeProvider } from 'next-themes';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import Logo from "../public/logo.png"; // Ensure this path is correct

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: 'devnet',
    options: {
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'BinaryBet',
        description: 'Binary Betting Platform',
        url: 'https://binary-bettting.vercel.app',
        icons: [Logo] // Ensure this is an array
      }
    }
  })
];

const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl('devnet');

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default MyApp;