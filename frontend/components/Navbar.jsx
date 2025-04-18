// frontend/components/Navbar.js
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const { connected, disconnect, publicKey, wallet } = useWallet();
    const { setVisible: setModalVisible } = useWalletModal();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Fix for SSR
    }, []);

    const isMobile = useCallback(() => {
        return isClient && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }, [isClient]);

    const handleConnect = async () => {
        if (!isClient) return;

        if (isMobile()) {
            try {
                // Try WalletConnect first
                if (wallet?.adapter.name === 'WalletConnect') {
                    await wallet.connect();
                    return;
                }

                // Mobile deep links
                const dappUrl = encodeURIComponent(window.location.href);
                const phantomLink = `phantom://ul/browse/${dappUrl}`;
                const solflareLink = `solflare://browse?url=${dappUrl}`;

                toast.info(
                    <div className="text-sm">
                        <p className="mb-2">🔒 Connect using:</p>
                        <button
                            onClick={() => window.location.href = phantomLink}
                            className="text-cyan-400 underline block w-full text-left"
                        >
                            Open in Phantom
                        </button>
                        <button
                            onClick={() => window.location.href = solflareLink}
                            className="text-cyan-400 underline block mt-1 w-full text-left"
                        >
                            Open in Solflare
                        </button>
                        <button
                            onClick={() => setModalVisible(true)}
                            className="text-cyan-400 underline block mt-1 w-full text-left"
                        >
                            Use WalletConnect QR
                        </button>
                    </div>,
                    { autoClose: false }
                );
                return;

            } catch (error) {
                toast.error('Failed to connect. Open in wallet browser.');
            }
        }

        // Desktop connection logic
        if (!wallet) {
            setModalVisible(true);
        } else {
            if (!connected) {
                try {
                    if (wallet.adapter.readyState === 'NotDetected') {
                        toast.error('Please install the wallet extension first.');
                        return;
                    }
                    await wallet.connect();
                } catch (error) {
                    console.error("Connection error:", error);
                    toast.error(`Connection failed: ${error.message}`);
                }
            } else {
                await disconnect();
            }
        }
    };

    const formatPublicKey = (key) => {
        if (!key) return '';
        return `${key.toString().slice(0, 5)}...${key.toString().slice(-5)}`;
    };

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`bg-gray-800/50 backdrop-blur-md border-b border-cyan-500/20 transition-all duration-300 ${
                    isSticky ? 'fixed top-0 left-0 w-full z-50' : 'relative'
                }`}
                initial={{ y: 0 }}
                animate={{ y: isSticky ? 0 : 0 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                BinaryBet
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/dashboard"
                                className="text-gray-300 hover:text-cyan-400 transition-all duration-300"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/betting"
                                className="text-gray-300 hover:text-cyan-400 transition-all duration-300"
                            >
                                Start Betting
                            </Link>
                            <button
                                onClick={handleConnect}
                                className="relative px-6 py-2 bg-cyan-600/30 rounded-lg group overflow-hidden"
                            >
                                <span className="relative z-10 text-cyan-400 group-hover:text-white transition-colors">
                                    {connected && publicKey
                                        ? formatPublicKey(publicKey)
                                        : 'Connect Wallet'}
                                </span>
                                <div className="absolute inset-0 bg-cyan-500/10 w-0 group-hover:w-full transition-all duration-300" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden px-4 pt-2 pb-3 space-y-2"
                    >
                        <Link
                            href="/dashboard"
                            className="block text-gray-300 hover:text-cyan-400 px-3 py-2"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/betting"
                            className="block text-gray-300 hover:text-cyan-400 px-3 py-2"
                        >
                            Start Betting
                        </Link>
                        <button
                            onClick={handleConnect}
                            className="w-full text-left px-3 py-2 text-cyan-400 hover:text-white"
                        >
                            {connected && publicKey
                                ? formatPublicKey(publicKey)
                                : 'Connect Wallet'}
                        </button>
                    </motion.div>
                )}
            </motion.nav>
            <ToastContainer position="bottom-right" theme="dark" />
        </>
    );
}