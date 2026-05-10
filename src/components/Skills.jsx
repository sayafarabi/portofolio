import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
import {
  SiTailwindcss,
  SiFirebase,
  SiTypescript,
  SiNextdotjs,
  SiVite,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FiZap, FiLayers, FiCpu } from "react-icons/fi";

/* ─────────────────────────────────────────────
   ICON MAP
───────────────────────────────────────────── */
const ICON_MAP = {
  HTML: { Icon: FaHtml5, color: "#e34c26" },
  CSS: { Icon: FaCss3Alt, color: "#264de4" },
  JavaScript: { Icon: FaJsSquare, color: "#f7df1e" },
  React: { Icon: FaReact, color: "#61dafb" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#38bdf8" },
  Git: { Icon: FaGitAlt, color: "#f05032" },
  GitHub: { Icon: FaGithub, color: "#e0e0e0" },
  Figma: { Icon: FaFigma, color: "#a259ff" },
  "VS Code": { Icon: VscVscode, color: "#007acc" },
  "Node.js": { Icon: FaNodeJs, color: "#68a063" },
  Firebase: { Icon: SiFirebase, color: "#ffca28" },
  TypeScript: { Icon: SiTypescript, color: "#3178c6" },
  "Next.js": { Icon: SiNextdotjs, color: "#ffffff" },
  Vite: { Icon: SiVite, color: "#a78bfa" },
};

const CAT_ICONS = { Frontend: FiLayers, Tools: FiZap, "Backend Dasar": FiCpu };
const CAT_COLORS = {
  Frontend: {
    main: "#00f0ff",
    glow: "rgba(0,240,255,0.25)",
    dim: "rgba(0,240,255,0.08)",
  },
  Tools: {
    main: "#a78bfa",
    glow: "rgba(167,139,250,0.25)",
    dim: "rgba(167,139,250,0.08)",
  },
  "Backend Dasar": {
    main: "#86efac",
    glow: "rgba(134,239,172,0.25)",
    dim: "rgba(134,239,172,0.08)",
  },
};

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes skill-shimmer {
    0%   { transform: translateX(-110%); }
    100% { transform: translateX(110%);  }
  }
  @keyframes radar-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes float-orb {
    0%,100% { transform: translateY(0) scale(1); }
    50%     { transform: translateY(-18px) scale(1.04); }
  }
  @keyframes bar-fill {
    from { width: 0; }
  }
  @keyframes tick-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`;

/* ─────────────────────────────────────────────
   COMPONENT: Section header
───────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="text-center mb-20">
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="inline-block text-[11px] font-mono tracking-[0.35em] text-[#00f0ff]/70 uppercase mb-4 px-4 py-1.5 border border-[#00f0ff]/20 rounded-full"
        style={{ background: "rgba(0,240,255,0.04)" }}
      >
        // tech stack
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className="text-4xl md:text-5xl font-black tracking-tight"
      >
        <span className="text-white">Skill </span>
        <span className="bg-gradient-to-r from-[#00f0ff] to-blue-400 bg-clip-text text-transparent">
          Saya
        </span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.28 }}
        className="mt-4 text-gray-500 text-sm max-w-md mx-auto font-mono"
      >
        Teknologi & tools yang saya kuasai untuk membangun produk modern.
      </motion.p>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.38, duration: 0.7 }}
        className="mt-5 mx-auto w-16 h-px bg-gradient-to-r from-[#00f0ff] to-transparent rounded-full"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Animated skill bar
───────────────────────────────────────────── */
function SkillBar({ name, level, delay, color, inView }) {
  const { Icon, color: iconColor } = ICON_MAP[name] || {
    Icon: null,
    color: "#00f0ff",
  };
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.45 }}
      className="group/bar"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* label row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <motion.div
              animate={
                hovered ? { scale: 1.3, rotate: -8 } : { scale: 1, rotate: 0 }
              }
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              style={{
                color: iconColor,
                filter: hovered ? `drop-shadow(0 0 6px ${iconColor})` : "none",
              }}
              className="text-base"
            >
              <Icon />
            </motion.div>
          )}
          <span className="text-sm font-medium text-gray-300 group-hover/bar:text-white transition-colors duration-200">
            {name}
          </span>
        </div>

        {/* percentage badge */}
        <motion.span
          animate={
            hovered ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.92 }
          }
          className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: color + "40", background: color + "12" }}
        >
          {level}%
        </motion.span>
      </div>

      {/* bar track */}
      <div
        className="relative h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {/* fill */}
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}90, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1.1,
            delay: delay + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
        {/* shimmer */}
        {inView && (
          <div
            className="absolute top-0 h-full w-1/2 rounded-full pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
              animation: `skill-shimmer 2.2s ease-in-out ${
                delay + 1
              }s infinite`,
            }}
          />
        )}
        {/* glow dot at tip */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          initial={{ left: 0, opacity: 0 }}
          animate={inView ? { left: `calc(${level}% - 4px)`, opacity: 1 } : {}}
          transition={{
            duration: 1.1,
            delay: delay + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Category card
───────────────────────────────────────────── */
function CategoryCard({ category, items, catIndex }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const [hovered, setHovered] = useState(false);
  const col = CAT_COLORS[category] || CAT_COLORS.Frontend;
  const CatIcon = CAT_ICONS[category] || FiLayers;
  const avgLevel = Math.round(
    items.reduce((s, i) => s + i.level, 0) / items.length
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: catIndex * 0.12,
        type: "spring",
        stiffness: 80,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden group"
      style={{
        border: `1px solid ${
          hovered ? col.main + "45" : "rgba(255,255,255,0.06)"
        }`,
        background: "rgba(5,10,20,0.7)",
        backdropFilter: "blur(20px)",
        boxShadow: hovered
          ? `0 20px 60px -15px ${col.glow}, 0 0 0 1px ${col.main}15`
          : "none",
        transition: "all 0.4s ease",
      }}
    >
      {/* top accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${col.main}, transparent)`,
        }}
        animate={{ opacity: hovered ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      />

      {/* bg glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse at top left, ${col.dim} 0%, transparent 65%)`,
        }}
      />

      <div className="relative p-6">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: col.dim, border: `1px solid ${col.main}30` }}
              animate={hovered ? { rotate: [0, -8, 8, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <CatIcon style={{ color: col.main, fontSize: 18 }} />
            </motion.div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {category}
              </h3>
              <p className="text-[10px] font-mono text-gray-600 mt-0.5">
                {items.length} skills
              </p>
            </div>
          </div>

          {/* radial avg score */}
          <RadialScore value={avgLevel} color={col.main} inView={inView} />
        </div>

        {/* skill bars */}
        <div className="space-y-4">
          {items.map((skill, idx) => (
            <SkillBar
              key={idx}
              name={skill.name}
              level={skill.level}
              delay={catIndex * 0.08 + idx * 0.07}
              color={col.main}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Radial score gauge
───────────────────────────────────────────── */
function RadialScore({ value, color, inView }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="3.5"
        />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={
            inView
              ? { strokeDashoffset: circ * (1 - value / 100) }
              : { strokeDashoffset: circ }
          }
          transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color}90)` }}
        />
      </svg>
      <span className="text-[11px] font-black font-mono" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Icon cloud ticker  ★ NEW
   All skill icons scrolling horizontally with glow
───────────────────────────────────────────── */
function IconTicker() {
  const allIcons = Object.entries(ICON_MAP);
  const doubled = [...allIcons, ...allIcons];

  return (
    <div className="relative overflow-hidden py-4 mb-16">
      {/* fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #020408, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #020408, transparent)" }}
      />

      <div
        className="flex gap-6"
        style={{
          animation: "tick-scroll 28s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map(([name, { Icon, color }], i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.25 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="group flex flex-col items-center gap-1.5 cursor-default"
            title={name}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:border-opacity-60"
              style={{
                background: color + "12",
                borderColor: color + "25",
                boxShadow: `0 0 0 0 ${color}40`,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 20px ${color}35`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = `0 0 0 0 ${color}40`)
              }
            >
              <Icon style={{ color, fontSize: 22 }} />
            </div>
            <span className="text-[9px] font-mono text-gray-600 group-hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Proficiency legend  ★ NEW
───────────────────────────────────────────── */
function ProficiencyLegend() {
  const levels = [
    { label: "Beginner", range: "0–40%", color: "#ef4444", w: "40%" },
    { label: "Intermediate", range: "40–70%", color: "#fbbf24", w: "70%" },
    { label: "Proficient", range: "70–90%", color: "#00f0ff", w: "90%" },
    { label: "Expert", range: "90–100%", color: "#a78bfa", w: "100%" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="mt-16 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
    >
      <p className="text-[10px] font-mono tracking-[0.28em] text-gray-600 uppercase mb-4">
        Proficiency Scale
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {levels.map((l, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: l.color }}
                initial={{ width: 0 }}
                whileInView={{ width: l.w }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.1 }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-gray-400">
                {l.label}
              </span>
              <span className="text-[9px] font-mono" style={{ color: l.color }}>
                {l.range}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Quick stats row  ★ NEW
───────────────────────────────────────────── */
function QuickStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const totalSkills = skills.reduce((s, c) => s + c.items.length, 0);
  const avgAll = Math.round(
    skills.flatMap((c) => c.items).reduce((s, i) => s + i.level, 0) /
      totalSkills
  );
  const topSkill = skills
    .flatMap((c) => c.items)
    .sort((a, b) => b.level - a.level)[0];

  const items = [
    { label: "Total Skills", value: totalSkills, suffix: "", color: "#00f0ff" },
    { label: "Avg Proficiency", value: avgAll, suffix: "%", color: "#a78bfa" },
    {
      label: "Top Skill",
      value: topSkill?.level ?? 95,
      suffix: "%",
      color: "#86efac",
      sub: topSkill?.name,
    },
    { label: "Categories", value: skills.length, suffix: "", color: "#fbbf24" },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
      {items.map((item, i) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
          if (!inView) return;
          let s = 0;
          const t = setInterval(() => {
            s += Math.ceil(item.value / 30);
            if (s >= item.value) {
              setCount(item.value);
              clearInterval(t);
            } else setCount(s);
          }, 40);
          return () => clearInterval(t);
        }, [inView, item.value]);

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.1, type: "spring" }}
            className="relative group p-5 rounded-2xl border border-white/[0.05] overflow-hidden text-center hover:border-opacity-40 transition-all duration-400"
            style={{ borderColor: item.color + "20" }}
            whileHover={{ borderColor: item.color + "50", y: -3 }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${item.color}08 0%, transparent 70%)`,
              }}
            />
            <div
              className="text-3xl font-black font-mono"
              style={{ color: item.color }}
            >
              {count}
              {item.suffix}
            </div>
            <div className="text-[10px] tracking-[0.18em] text-gray-600 uppercase mt-1">
              {item.label}
            </div>
            {item.sub && (
              <div className="text-[9px] text-gray-700 mt-0.5 font-mono truncate">
                {item.sub}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Floating background
───────────────────────────────────────────── */
function Background() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.035]"
        style={{
          background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)",
          animation: "float-orb 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
          animation: "float-orb 20s ease-in-out infinite 5s",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,1) 1px,transparent 1px),linear-gradient(to right,rgba(0,240,255,1) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN Skills
───────────────────────────────────────────── */
const Skills = () => {
  return (
    <section
      id="skills"
      className="relative py-28 overflow-hidden"
      style={{ background: "#020408" }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <Background />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader />

        {/* Quick stats */}
        <QuickStats />

        {/* Icon ticker */}
        <IconTicker />

        {/* Category cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((cat, i) => (
            <CategoryCard
              key={i}
              category={cat.category}
              items={cat.items}
              catIndex={i}
            />
          ))}
        </div>

        {/* Proficiency legend */}
        <ProficiencyLegend />
      </div>
    </section>
  );
};

export default Skills;
