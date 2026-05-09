import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { Link } from "react-scroll";

// Konstanta untuk SVG ring
const SIZE = 56;
const STROKE_WIDTH = 3;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Update progress dan visibility saat scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress =
        scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
      setProgress(currentProgress);
      setVisible(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hitung offset untuk SVG ring
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Tooltip saat hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white whitespace-nowrap pointer-events-none"
              >
                Kembali ke atas ({Math.round(progress)}%)
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 border-b border-r border-white/10 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tombol dengan SVG progress ring */}
          <Link
            to="home"
            smooth
            spy
            duration={500}
            offset={-70}
            className="group relative cursor-pointer flex items-center justify-center"
            aria-label="Back to top"
          >
            {/* SVG Progress Ring */}
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={STROKE_WIDTH}
              />
              {/* Animated progress circle */}
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="rgba(0, 240, 255, 0.8)"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  filter: "drop-shadow(0 0 6px rgba(0, 240, 255, 0.8))",
                }}
              />
            </svg>

            {/* Ikon panah di tengah dengan background glass */}
            <div
              className={`absolute inset-0 m-auto w-10 h-10 rounded-full glass flex items-center justify-center text-neon transition-all duration-300 ${
                isHovered
                  ? "bg-neon/20 shadow-[0_0_20px_rgba(0,240,255,0.6)]"
                  : "bg-neon/10"
              }`}
            >
              <FiArrowUp
                size={20}
                className={`transition-transform duration-300 ${
                  isHovered ? "-translate-y-1" : ""
                }`}
              />
            </div>

            {/* Ripple effect saat diklik */}
            <motion.div
              className="absolute inset-0 rounded-full bg-neon/30 pointer-events-none"
              initial={{ scale: 0.6, opacity: 0 }}
              whileTap={{ scale: 1.4, opacity: 0.3 }}
              transition={{ duration: 0.4 }}
            />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
