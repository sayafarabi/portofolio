import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { experienceTimeline } from "../data/data";
import {
  FaCode,
  FaBolt,
  FaRocket,
  FaReact,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";

// Ikon mewakili tiap fase perjalanan, terasa lebih profesional
const milestoneIcons = [
  FaCode, // Mulai Belajar HTML & CSS
  FaBolt, // JavaScript
  FaRocket, // Project Pertama
  FaReact, // React & Ekosistem
  FaBriefcase, // Portfolio Modern
  FaGraduationCap, // Proyek Kuliah
];

const Experience = () => {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-20 bg-dark/50 relative overflow-hidden"
    >
      {/* Background orbs animasi */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-neon/8 rounded-full blur-[130px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-0 w-80 h-80 bg-blue-600/6 rounded-full blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              className="h-1 w-24 bg-gradient-to-r from-neon via-blue-500 to-transparent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Perjalanan <span className="text-neon">Belajar</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-lg mx-auto">
            Setiap langkah membentuk fondasi hari ini.
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative">
          {/* Garis vertikal animasi */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 overflow-hidden">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-neon/60 via-blue-400/40 to-transparent rounded-full"
              initial={{ height: 0 }}
              animate={sectionInView ? { height: "100%" } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          {/* Items */}
          <div className="space-y-8 md:space-y-12">
            {experienceTimeline.map((item, index) => {
              const isLeft = index % 2 === 0;
              const IconComponent = milestoneIcons[index] || FaCode;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex flex-col md:flex-row items-start md:items-center relative pl-12 md:pl-0 ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Dot dengan ripple */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-20">
                    <motion.div
                      className="w-5 h-5 bg-dark border-2 border-neon rounded-full shadow-[0_0_12px_rgba(0,240,255,0.7)]"
                      whileHover={{ scale: 1.6 }}
                      animate={{
                        boxShadow: [
                          "0 0 8px rgba(0,240,255,0.6)",
                          "0 0 22px rgba(0,240,255,0.9)",
                          "0 0 8px rgba(0,240,255,0.6)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full border border-neon/50"
                        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Card */}
                  <motion.div
                    className={`w-full md:w-[45%] glass p-5 md:p-6 rounded-2xl border border-white/5 backdrop-blur-md relative group cursor-default ${
                      isLeft
                        ? "md:mr-auto md:pr-10 md:text-right"
                        : "md:ml-auto md:pl-10 md:text-left"
                    }`}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      boxShadow:
                        "0 25px 40px -15px rgba(0,240,255,0.2), 0 0 30px rgba(0,240,255,0.15)",
                      borderColor: "rgba(0,240,255,0.4)",
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon/8 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Ikon & Tahun */}
                    <div
                      className={`flex items-center gap-3 mb-4 ${
                        isLeft ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <motion.div
                        whileHover={{ rotate: [0, -15, 15, 0] }}
                        transition={{ duration: 0.5 }}
                        className="text-neon text-2xl bg-neon/10 p-2 rounded-xl border border-neon/20"
                      >
                        {IconComponent && <IconComponent />}
                      </motion.div>
                      <span className="inline-block px-3 py-1 text-xs font-mono font-bold text-neon bg-neon/10 border border-neon/20 rounded-full">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-neon transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Panah kecil ke garis */}
                    <div
                      className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-glass border border-white/5 rotate-45 ${
                        isLeft ? "-right-2" : "-left-2"
                      }`}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
