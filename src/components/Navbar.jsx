import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document
      .getElementById(id.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
          : ""
      }`}
    >
      {/* Garis gradien bawah saat scroll (opsional) */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo – sekarang tombol kembali ke Home */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => scrollTo("home")}
          className="relative font-black text-xl text-white group cursor-pointer focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Kembali ke Home"
        >
          <span className="text-cyan-400">&lt;</span>
          <span className="transition-colors duration-300 group-hover:text-cyan-300">
            RAF
          </span>
          <span className="text-cyan-400">/&gt;</span>
          {/* Efek glow di bawah teks saat hover */}
          <motion.span
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
            layoutId="logoUnderline"
          />
        </motion.button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link, i) => (
            <motion.button
              key={link}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => scrollTo(link)}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                active === link.toLowerCase()
                  ? "text-cyan-400 bg-cyan-400/10 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link}
              {/* Underline animasi saat hover untuk semua link */}
              <span
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-cyan-400 rounded-full transition-all duration-300 ${
                  active === link.toLowerCase()
                    ? "w-3/4"
                    : "w-0 group-hover:w-3/4"
                }`}
              />
            </motion.button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-2 relative z-20"
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

      {/* Mobile Menu dengan animasi stagger */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/5"
          >
            <div className="py-4 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link)}
                  className={`w-full text-left px-8 py-3 text-sm font-medium transition-all duration-200 ${
                    active === link.toLowerCase()
                      ? "text-cyan-400 bg-cyan-400/10 border-l-2 border-cyan-400"
                      : "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
                  }`}
                >
                  {link}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
