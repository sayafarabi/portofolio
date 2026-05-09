import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { personalInfo } from "../data/data";
import { Link } from "react-scroll";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const inView = useInView(footerRef, { once: true, amount: 0.3 });

  // Animasi container
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      ref={footerRef}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative py-10 border-t border-white/5 bg-dark overflow-hidden"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />

      {/* Decorative background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main flex container */}
        <motion.div
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Left: Copyright + tagline */}
          <motion.div
            variants={itemVariants}
            className="text-center md:text-left"
          >
            <p className="text-gray-400 text-sm">
              © {currentYear}{" "}
              <span className="text-white font-semibold">
                {personalInfo.name}
              </span>
              . All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Dibangun dengan ❤️ menggunakan React & Tailwind CSS
            </p>
          </motion.div>

          {/* Right: Social icons + Back to top */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-5"
          >
            {/* Social Icons dengan tooltip */}
            <div className="flex items-center gap-3">
              {personalInfo.socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  title={social.name}
                >
                  <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 group-hover:text-neon group-hover:border-neon/40 group-hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all duration-300">
                    <social.icon className="text-lg" />
                  </div>
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-neon bg-dark/90 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {social.name}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 hidden sm:block" />

            {/* Back to Top dengan pulse */}
            <Link
              to="home"
              smooth
              spy
              duration={500}
              className="cursor-pointer"
              aria-label="Back to top"
            >
              <motion.div
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-gray-400 hover:text-neon hover:border-neon/40 transition-all duration-300 group"
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(0,240,255,0)",
                    "0 0 0 8px rgba(0,240,255,0.1)",
                    "0 0 0 0 rgba(0,240,255,0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FiArrowUp className="text-lg group-hover:-translate-y-0.5 transition-transform" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
