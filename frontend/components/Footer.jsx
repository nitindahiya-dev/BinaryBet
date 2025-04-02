import React from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">BinaryBet</h3>
              <p className="text-gray-400">
                Decentralized betting platform powered by Solana blockchain.
              </p>
            </div>
            <div>
              <h4 className="text-white mb-4">Navigation</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'Betting', path: '/betting' },
                  { name: 'Recent Activity', path: 'recentactivity' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.path} className="text-gray-400 hover:text-cyan-400 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {[
                  { name: 'Terms', path: '/terms' },
                  { name: 'Privacy', path: '/privacy' },
                  { name: 'Responsibility', path: '/responsibility' },
                  { name: 'FAQ', path: '/faq' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.path} className="text-gray-400 hover:text-cyan-400 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Social</h4>
              <div className="flex space-x-4">
                {['Github'].map((social, idx) => (
                  <motion.a
                    key={idx}
                    whileHover={{ y: -2 }}
                    href="https://github.com/nitindahiya-dev/BinaryBet"
                    target='_blank'
                    rel='noopener noreferrer'
                    className="text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © {new Date().getFullYear()} BinaryBet. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer