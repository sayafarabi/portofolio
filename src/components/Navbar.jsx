import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiCode, FiArrowUpRight, FiClock } from "react-icons/fi";

const NAV_LINKS = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Contact",
];

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // State untuk jam real-time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Spotlight effect
  const navbarRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Deteksi scroll dan progress bar
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolledVal = window.pageYOffset;
      setScrollProgress(docHeight > 0 ? (scrolledVal / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handler spotlight mouse
  const handleMouseMove = (e) => {
    const rect = navbarRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id.toLowerCase());
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Format waktu: "Sen, 01 Jan 2026 · 14:30:00"
  const formatTime = (date) => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${dayName}, ${day} ${month} ${year} · ${hours}:${minutes}:${seconds}`;
  };

  return (
    <nav
      ref={navbarRef}
      onMouseMove={handleMouseMove}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      {/* Spotlight effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 md:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(0,240,255,0.08), transparent 40%)`,
        }}
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-neon via-cyan-400 to-blue-500 rounded-full"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => scrollTo("home")}
          className="relative flex items-center gap-1 font-black text-xl text-white group cursor-pointer select-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Kembali ke Home"
        >
          <div className="relative w-7 h-7 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center mr-1 group-hover:bg-neon/20 transition-colors">
            <FiCode className="text-neon text-sm" />
          </div>
          <span className="text-cyan-400">&lt;</span>
          <span className="transition-colors duration-300 group-hover:text-cyan-300">
            RAF
          </span>
          <span className="text-cyan-400">/&gt;</span>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-neon/10 border border-neon/20 text-neon text-[10px] font-mono px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            &lt; Home /&gt;
          </div>
        </motion.button>

        {/* Desktop Links + Jam */}
        <div className="hidden md:flex items-center gap-2">
          {/* Links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => scrollTo(link)}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 group ${
                  active === link.toLowerCase()
                    ? "text-gray-900 bg-gradient-to-r from-neon to-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link}
                {active === link.toLowerCase() && (
                  <motion.span
                    layoutId="activeDot"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_5px_rgba(0,240,255,0.8)]"
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Jam Real-time */}
          <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/5 text-white/80 hover:text-neon transition-colors">
            <FiClock className="text-neon text-xs" />
            <span className="font-mono text-xs tracking-wide">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Hamburger untuk mobile */}
        <button
          className="md:hidden relative z-20 text-white p-2"
          onClick={() => setMenuOpen((m) => !m)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span
              className={`block h-0.5 bg-cyan-400 transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-cyan-400 transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-cyan-400 transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
            <div className="py-4 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link)}
                  className={`w-full text-left px-8 py-3 text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                    active === link.toLowerCase()
                      ? "text-neon bg-neon/5 border-l-4 border-neon shadow-[inset_0_0_10px_rgba(0,240,255,0.05)]"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-white/5 border-l-4 border-transparent"
                  }`}
                >
                  {link === "Home" && "🏠"}
                  {link === "About" && "👤"}
                  {link === "Skills" && "⚡"}
                  {link === "Projects" && "📁"}
                  {link === "Experience" && "📅"}
                  {link === "Contact" && "✉️"}
                  <span>{link}</span>
                  {active === link.toLowerCase() && (
                    <FiArrowUpRight className="text-neon ml-auto" size={14} />
                  )}
                </motion.button>
              ))}
              {/* Jam juga di mobile menu */}
              <div className="px-8 py-3 text-xs font-mono text-gray-400 flex items-center gap-2 border-t border-white/5 mt-2">
                <FiClock className="text-neon" />
                {formatTime(currentTime)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
