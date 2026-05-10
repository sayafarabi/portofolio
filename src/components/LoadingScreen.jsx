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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.05,
        transition: { duration: 0.6, ease: "easeInOut" },
      }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[130px]"
          animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Grid halus */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(0,240,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo dengan partikel */}
      <div className="relative mb-8">
        <motion.div
          className="text-5xl font-black text-white relative z-10"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <span className="text-neon">&lt;</span>
          <span className="relative">
            RF
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon rounded-full"
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
            />
          </span>
          <span className="text-neon">/&gt;</span>
        </motion.div>

        {/* Partikel kecil mengambang di sekitar logo */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-neon"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Progress bar container */}
      <div className="relative w-64">
        {/* Label */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400 font-mono tracking-[0.2em] uppercase">
            Loading
          </span>
          <motion.span
            className="text-xs font-mono text-neon"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {progress}%
          </motion.span>
        </div>

        {/* Progress track */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
          {/* Background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

          {/* Progress fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-neon to-blue-500 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          >
            {/* Glow on fill */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-full bg-neon/50 rounded-full blur-md" />
          </motion.div>
        </div>

        {/* Teks "Tunggu sebentar" */}
        <motion.p
          className="text-gray-500 text-xs text-center mt-3"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
        >
          Tunggu sebentar...
        </motion.p>
      </div>

      {/* Shimmer animation style */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingScreen;
