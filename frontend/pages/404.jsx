import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiCompass, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <Layout>
      <section className="min-h-screen py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-12"
          >
            <FiCompass className="w-32 h-32 text-purple-400 opacity-50" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-8">
              404
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              Lost in the decentralized void?
            </p>
            <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-purple-400/20">
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                The page you're looking for has drifted into deep space. 
                Let's get you back to civilization.
              </p>
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4 rounded-xl font-medium cursor-pointer"
                >
                  <span>Return Home</span>
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;