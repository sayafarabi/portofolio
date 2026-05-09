import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations";
import { personalInfo, aboutStats } from "../data/data";
import {
  FaDownload,
  FaEnvelope,
  FaGraduationCap,
  FaHeart,
  FaMapMarkerAlt,
  FaCoffee,
} from "react-icons/fa";

// Counter animasi (reusable)
const AnimatedCounter = ({ value, duration = 2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ counter: 0 }}
        animate={inView ? { counter: value } : {}}
        transition={{ duration, ease: "easeOut" }}
      >
        {({ counter }) => Math.round(counter)}
      </motion.span>
    </motion.span>
  );
};

const About = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Parallax background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Data tambahan (bisa dimasukkan ke data.js juga)
  const highlights = [
    {
      icon: FaGraduationCap,
      label: "S1 Ilmu Komputer",
      sub: "2024 - Sekarang",
    },
    { icon: FaMapMarkerAlt, label: "Jakarta, Indonesia", sub: "Remote ready" },
    { icon: FaHeart, label: "UI/UX & Open Source", sub: "Passion" },
    { icon: FaCoffee, label: "Kopi & Coding", sub: "Fuel" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-dark relative overflow-hidden"
    >
      {/* Animated background orbs + grid */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[180px]" />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[130px]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(0,240,255,0.4) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Kolom Kiri: Teks + Highlights */}
          <motion.div
            variants={fadeIn("right", "spring", 0, 0.8)}
            className="space-y-8"
          >
            <div>
              <motion.div
                className="w-20 h-1 bg-gradient-to-r from-neon to-transparent rounded-full mb-6"
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tentang{" "}
                <span className="text-neon relative inline-block">
                  Saya
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-neon rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </h2>
              <p className="text-gray-300 leading-relaxed text-base">
                {personalInfo.description}
              </p>
            </div>

            {/* Kutipan personal */}
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="border-l-4 border-neon/50 pl-4 italic text-gray-400 text-sm"
            >
              "Saya percaya bahwa kombinasi antara desain estetis, interaksi
              halus, dan performa optimal adalah kunci website modern."
            </motion.blockquote>

            {/* Highlights grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-3"
            >
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-neon/20 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-colors">
                    <item.icon className="text-sm" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">
                      {item.label}
                    </p>
                    <p className="text-gray-500 text-[10px]">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Kolom Kanan: Statistik & Education */}
          <motion.div
            variants={fadeIn("left", "spring", 0.3, 0.8)}
            className="relative space-y-8"
          >
            {/* Card statistik */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-neon/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative">
                <h3 className="text-xl font-semibold text-neon mb-6 flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                    className="text-2xl"
                  >
                    📊
                  </motion.span>
                  Perjalanan & Statistik
                </h3>
                <div
                  ref={statsRef}
                  className="grid grid-cols-3 gap-4 text-center"
                >
                  {aboutStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                      whileHover={{ y: -3, scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <p className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center">
                        <AnimatedCounter value={stat.value} />
                        <span className="text-neon ml-1">+</span>
                      </p>
                      <p className="text-xs md:text-sm text-gray-400">
                        {stat.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card Pendidikan (lebih detail) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass p-6 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center text-2xl">
                  🎓
                </div>
                <div>
                  <h4 className="text-white font-semibold">Pendidikan</h4>
                  <p className="text-neon text-sm font-mono">
                    S1 Ilmu Komputer
                  </p>
                  <p className="text-gray-400 text-xs">
                    Universitas • 2024 – Sekarang
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tombol aksi di bawah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex justify-center mt-12 gap-4"
        >
          <a
            href={personalInfo.cvLink || "#"}
            download
            className="px-6 py-3 bg-neon text-dark font-bold rounded-full hover:bg-neon/90 transition-all flex items-center gap-2 hover:scale-105 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <FaDownload /> Download CV
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 border border-neon text-neon font-bold rounded-full hover:bg-neon/10 transition-all flex items-center gap-2 hover:scale-105 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
          >
            <FaEnvelope /> Hubungi Saya
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
