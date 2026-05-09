import { motion } from "framer-motion";
import { Link } from "react-scroll";
import {
  FiDownload,
  FiMail,
  FiChevronDown,
  FiGithub,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";
import { personalInfo } from "../data/data";
import { useTypingEffect } from "../hooks/useTypingEffect";
import ParticleBackground from "./ParticleBackground";

const Hero = () => {
  const typedText = useTypingEffect([
    "Frontend Developer",
    "React Developer",
    "Computer Science Student",
  ]);

  // Statistik singkat (bisa diganti data dari data.js jika ada)
  const stats = [
    { label: "Pengalaman", value: "2+", suffix: "tahun" },
    { label: "Proyek", value: "15+", suffix: "selesai" },
    { label: "Teknologi", value: "10+", suffix: "dikuasai" },
  ];

  // Variant animasi untuk stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-dark via-dark to-dark-card opacity-90" />
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-neon/5 via-transparent to-blue-500/5"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(0,240,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-neon/10 rounded-full blur-[120px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[150px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Particle Background */}
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Foto Profil dengan double ring & status */}
          <motion.div variants={itemVariants} className="mb-8 relative">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-neon glow-neon relative">
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-neon opacity-50"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
            </div>
            {/* Status dot */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-4 border-dark shadow-[0_0_8px_rgba(74,222,128,0.8)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>

          {/* Nama dengan gradient text */}
          <motion.div variants={itemVariants}>
            <span className="text-xs font-mono tracking-[0.3em] text-neon/80 uppercase mb-3 inline-block">
              Hello, I'm
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="text-white">Halo, Saya </span>
              <span className="bg-gradient-to-r from-neon to-blue-500 bg-clip-text text-transparent">
                {personalInfo.name}
              </span>
            </h1>
          </motion.div>

          {/* Typing Animation */}
          <motion.div
            variants={itemVariants}
            className="mt-4 text-xl md:text-2xl lg:text-3xl font-mono text-gray-300 h-12 flex items-center justify-center"
          >
            <span>{typedText}</span>
            <span className="typing-cursor ml-1"></span>
          </motion.div>

          {/* Deskripsi */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl mx-auto text-gray-400 text-sm md:text-base leading-relaxed"
          >
            {personalInfo.description}
          </motion.p>

          {/* Statistik mini */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap justify-center gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-neon">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-400">
                  {stat.label}
                  <br />
                  {stat.suffix}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Tombol CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <a
              href={personalInfo.cvLink}
              download
              className="group relative px-8 py-3 rounded-full bg-neon text-dark font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,240,255,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FiDownload className="text-lg" /> Download CV
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <Link
              to="contact"
              smooth
              spy
              duration={500}
              offset={-70}
              className="group relative px-8 py-3 rounded-full border border-neon text-neon font-bold text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <FiMail className="text-lg" /> Contact Me
              </span>
              <div className="absolute inset-0 bg-neon opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </Link>
          </motion.div>

          {/* Social Media Icons dengan tooltip */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex justify-center gap-5"
          >
            {personalInfo.socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-xl text-gray-400 hover:text-neon hover:border-neon/40 hover:bg-neon/10 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.1 }}
                title={social.name}
              >
                <social.icon />
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-neon opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-dark/80 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-sm">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator yang lebih modern */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] text-gray-500 tracking-[0.3em] uppercase font-mono">
          Scroll
        </span>
        <Link
          to="about"
          smooth
          spy
          offset={-70}
          className="w-6 h-10 border border-white/10 rounded-full flex justify-center pt-1.5 hover:border-neon/50 transition-all"
        >
          <motion.div className="w-0.5 h-2 bg-neon rounded-full animate-pulse" />
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
