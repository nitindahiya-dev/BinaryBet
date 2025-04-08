// frontend/pages/_app.js
import '../styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ThemeProvider } from 'next-themes';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Validate the RPC endpoint from the environment
const rpcFromEnv = process.env.NEXT_PUBLIC_SOLANA_RPC;
const endpoint =
  rpcFromEnv && (rpcFromEnv.startsWith('http://') || rpcFromEnv.startsWith('https://'))
    ? rpcFromEnv
    : clusterApiUrl('devnet'); // Fallback to devnet if missing or misconfigured

function MyApp({ Component, pageProps }) {
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

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
