import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <motion.div
        className="text-4xl font-bold text-neon mb-4"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        &lt;RF /&gt;
      </motion.div>
      <div className="w-48 h-1 bg-gray-800 rounded overflow-hidden">
        <motion.div
          className="h-full bg-neon"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>
      <p className="text-gray-400 text-sm mt-2">{progress}%</p>
    </motion.div>
  );
};

export default LoadingScreen;
