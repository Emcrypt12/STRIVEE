import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          className="text-primary-600 mb-4"
        >
          <Activity size={48} />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-700">Loading STRIVE...</h3>
      </motion.div>
    </div>
  );
}