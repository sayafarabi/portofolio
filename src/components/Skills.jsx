import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../animations";
import { skills } from "../data/data";
import {
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaReact,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaNodeJs,
} from "react-icons/fa";
import { SiTailwindcss, SiFirebase } from "react-icons/si"; // yang ini aman
import { VscVscode } from "react-icons/vsc"; // alternatif stabil untuk VS Code

// Mapping nama skill ke komponen ikon
const skillIconMap = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  JavaScript: FaJsSquare,
  React: FaReact,
  "Tailwind CSS": SiTailwindcss,
  Git: FaGitAlt,
  GitHub: FaGithub,
  Figma: FaFigma,
  "VS Code": VscVscode,
  "Node.js": FaNodeJs,
  Firebase: SiFirebase,
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 relative overflow-hidden bg-dark/50">
      {/* Background decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.8) 1px, transparent 1px), linear-gradient(to right, rgba(0,240,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-neon/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] animate-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="h-1 w-20 bg-gradient-to-r from-neon to-transparent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Skill <span className="text-neon">Saya</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Teknologi dan alat yang biasa saya gunakan untuk membangun
            pengalaman web modern.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skills.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              variants={fadeIn("up", "spring", catIndex * 0.2, 0.6)}
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="glass p-6 rounded-2xl border border-white/5 hover:border-neon/40 transition-all duration-300 group relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative">
                <h3 className="text-xl font-semibold text-neon mb-6 flex items-center gap-2">
                  <span className="bg-neon/10 p-1.5 rounded-lg">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    >
                      {category.category === "Frontend" && "⚛️"}
                      {category.category === "Tools" && "🛠️"}
                      {category.category === "Backend Dasar" && "⚙️"}
                    </motion.div>
                  </span>
                  {category.category}
                </h3>
                <div className="space-y-5">
                  {category.items.map((skill, idx) => {
                    const IconComp = skillIconMap[skill.name] || null;
                    return (
                      <div key={idx} className="group/skill">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-300 flex items-center gap-2">
                            {IconComp ? (
                              <IconComp className="text-neon text-base group-hover/skill:scale-110 transition-transform" />
                            ) : (
                              <span className="text-base">{skill.icon}</span>
                            )}
                            {skill.name}
                          </span>
                          <motion.span
                            className="text-neon font-mono bg-neon/10 px-2 py-0.5 rounded-full text-xs opacity-0 group-hover/skill:opacity-100 transition-opacity"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                          >
                            {skill.level}%
                          </motion.span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-800/50 rounded-full overflow-hidden relative">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.2,
                              ease: "easeOut",
                              delay: idx * 0.1,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default Skills;
