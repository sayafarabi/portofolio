import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { experienceTimeline } from "../data/data";
import {
  FaCode,
  FaBolt,
  FaRocket,
  FaReact,
  FaBriefcase,
  FaGraduationCap,
  FaChevronDown,
} from "react-icons/fa";

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const milestoneIcons = [
  FaCode,
  FaBolt,
  FaRocket,
  FaReact,
  FaBriefcase,
  FaGraduationCap,
];

const ACCENT_COLORS = [
  { main: "#00f0ff", glow: "rgba(0,240,255,0.3)", bg: "rgba(0,240,255,0.06)" },
  {
    main: "#60a5fa",
    glow: "rgba(96,165,250,0.3)",
    bg: "rgba(96,165,250,0.06)",
  },
  {
    main: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
    bg: "rgba(167,139,250,0.06)",
  },
  {
    main: "#34d399",
    glow: "rgba(52,211,153,0.3)",
    bg: "rgba(52,211,153,0.06)",
  },
  {
    main: "#f472b6",
    glow: "rgba(244,114,182,0.3)",
    bg: "rgba(244,114,182,0.06)",
  },
  {
    main: "#fbbf24",
    glow: "rgba(251,191,36,0.3)",
    bg: "rgba(251,191,36,0.06)",
  },
];

/* ─────────────────────────────────────────────
   HOOK: Scramble text on hover
───────────────────────────────────────────── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
function useScrambleHover(text) {
  const [display, setDisplay] = useState(text);
  const raf = useRef(null);

  const scramble = () => {
    let iter = 0;
    clearInterval(raf.current);
    raf.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            i < iter
              ? ch
              : ch === " "
              ? " "
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      iter += 1.5;
      if (iter >= text.length) {
        clearInterval(raf.current);
        setDisplay(text);
      }
    }, 30);
  };
  const reset = () => {
    clearInterval(raf.current);
    setDisplay(text);
  };
  return { display, scramble, reset };
}

/* ─────────────────────────────────────────────
   COMPONENT: Animated vertical progress line
───────────────────────────────────────────── */
function TimelineLine({ inView }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px overflow-visible pointer-events-none">
      {/* Base dim line */}
      <div className="absolute inset-0 bg-white/[0.04]" />
      {/* Animated fill */}
      <motion.div
        className="absolute top-0 left-0 w-full rounded-full"
        style={{
          background:
            "linear-gradient(to bottom, #00f0ff, #60a5fa, #a78bfa, transparent)",
        }}
        initial={{ height: 0 }}
        animate={inView ? { height: "100%" } : { height: 0 }}
        transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {/* Traveling glow dot */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
        style={{
          background: "#00f0ff",
          boxShadow: "0 0 16px #00f0ff, 0 0 32px rgba(0,240,255,0.5)",
        }}
        initial={{ top: 0, opacity: 0 }}
        animate={inView ? { top: ["0%", "100%"], opacity: [0, 1, 1, 0] } : {}}
        transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Milestone dot with ripple
───────────────────────────────────────────── */
function MilestoneDot({ color, active, index }) {
  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      {/* Ripple rings */}
      {active &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ borderColor: color.main + "60" }}
            initial={{ width: 16, height: 16, opacity: 0.8 }}
            animate={{ width: 56, height: 56, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}
      {/* Core */}
      <motion.div
        className="relative z-10 w-4 h-4 rounded-full border-2 flex items-center justify-center"
        style={{
          background: active ? color.main : "#0a0f1a",
          borderColor: color.main,
          boxShadow: active
            ? `0 0 16px ${color.main}, 0 0 32px ${color.glow}`
            : `0 0 6px ${color.main}`,
        }}
        animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Number badge */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-black font-mono"
        style={{ color: color.main }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Experience Card
───────────────────────────────────────────── */
function ExperienceCard({ item, index, isLeft, color, isActive, onHover }) {
  const Icon = milestoneIcons[index % milestoneIcons.length];
  const { display, scramble, reset } = useScrambleHover(item.title);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, amount: 0.3 });

  // 3D tilt
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 20 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rotY.set(((e.clientX - rect.left) / rect.width - 0.5) * 12);
    rotX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 12);
  };
  const handleLeave = () => {
    rotX.set(0);
    rotY.set(0);
    reset();
    onHover(null);
  };
  const handleEnter = () => {
    scramble();
    onHover(index);
  };

  // Tags — safe fallback
  const tags = item.tags || item.tech || [];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        type: "spring",
        stiffness: 80,
      }}
      className={`w-full md:w-[46%] ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="relative rounded-2xl border overflow-hidden cursor-default"
        style={{
          background: "rgba(5,10,20,0.8)",
          borderColor: isActive ? color.main + "60" : "rgba(255,255,255,0.06)",
          boxShadow: isActive
            ? `0 20px 60px -10px ${color.glow}, 0 0 0 1px ${color.main}20`
            : "none",
          backdropFilter: "blur(20px)",
          transform: "translateZ(0)",
        }}
        animate={{
          borderColor: isActive ? color.main + "60" : "rgba(255,255,255,0.06)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Top color bar */}
        <motion.div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(to right, transparent, ${color.main}, transparent)`,
          }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
        />

        {/* Shimmer layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${color.bg} 0%, transparent 60%)`,
            opacity: isActive ? 1 : 0,
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative p-6" style={{ transform: "translateZ(20px)" }}>
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Icon box */}
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0 border"
                style={{
                  background: color.bg,
                  borderColor: color.main + "40",
                  color: color.main,
                }}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Icon />
              </motion.div>
              {/* Year badge */}
              <span
                className="px-3 py-1 text-[10px] font-mono font-bold rounded-full border"
                style={{
                  color: color.main,
                  background: color.bg,
                  borderColor: color.main + "30",
                }}
              >
                {item.year}
              </span>
            </div>

            {/* Index number big display */}
            <span
              className="text-5xl font-black font-mono opacity-[0.06] leading-none select-none"
              style={{ color: color.main }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Title with scramble */}
          <h3
            className="text-lg font-black text-white mb-2 tracking-tight font-mono transition-colors duration-200"
            style={{ color: isActive ? color.main : "white" }}
          >
            {display}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + i * 0.05 + 0.4 }}
                  className="px-2.5 py-0.5 text-[10px] font-mono rounded-full border"
                  style={{
                    color: color.main + "cc",
                    borderColor: color.main + "20",
                    background: color.bg,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Bottom progress bar */}
          <div className="mt-4 pt-4 border-t border-white/[0.05]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                Milestone
              </span>
              <span
                className="text-[9px] font-mono"
                style={{ color: color.main }}
              >
                {Math.round(((index + 1) / experienceTimeline.length) * 100)}%
              </span>
            </div>
            <div className="h-0.5 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${color.main}, ${color.main}60)`,
                }}
                initial={{ width: 0 }}
                animate={
                  inView
                    ? {
                        width: `${Math.round(
                          ((index + 1) / experienceTimeline.length) * 100
                        )}%`,
                      }
                    : {}
                }
                transition={{
                  duration: 1,
                  delay: index * 0.1 + 0.5,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        </div>

        {/* Connector arrow */}
        <div
          className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border ${
            isLeft
              ? "-right-1.5 border-l-0 border-b-0"
              : "-left-1.5 border-r-0 border-t-0"
          }`}
          style={{
            background: "rgba(5,10,20,0.8)",
            borderColor: isActive
              ? color.main + "60"
              : "rgba(255,255,255,0.06)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Section Header
───────────────────────────────────────────── */
function SectionHeader({ inView }) {
  return (
    <div className="text-center mb-24">
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="inline-block text-[11px] font-mono tracking-[0.35em] text-[#00f0ff]/70 uppercase mb-4 px-4 py-1.5 border border-[#00f0ff]/20 rounded-full"
        style={{ background: "rgba(0,240,255,0.04)" }}
      >
        // perjalanan belajar
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="text-4xl md:text-6xl font-black tracking-tight leading-none"
      >
        <span className="text-white">Milestone </span>
        <span className="bg-gradient-to-r from-[#00f0ff] via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Perjalanan
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 }}
        className="mt-4 text-gray-600 text-sm font-mono max-w-sm mx-auto"
      >
        Setiap langkah membentuk fondasi hari ini.
      </motion.p>

      {/* Animated gradient divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-6 mx-auto h-px w-32"
        style={{
          background:
            "linear-gradient(to right, transparent, #00f0ff, transparent)",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Summary bar (bottom)
───────────────────────────────────────────── */
function SummaryBar({ inView }) {
  const items = [
    { label: "Tahun Belajar", value: "2+" },
    { label: "Milestone", value: `${experienceTimeline.length}` },
    { label: "Teknologi", value: "10+" },
    { label: "Proyek", value: "15+" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7 + i * 0.1 }}
          className="relative group p-5 rounded-2xl border border-white/[0.05] text-center overflow-hidden hover:border-[#00f0ff]/20 transition-colors duration-500"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(circle at center, rgba(0,240,255,0.04) 0%, transparent 70%)",
            }}
          />
          <div className="text-3xl font-black font-mono text-white">
            {item.value}
          </div>
          <div className="text-[10px] tracking-[0.2em] text-gray-600 uppercase mt-1">
            {item.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Floating particles bg
───────────────────────────────────────────── */
function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 10 + 8,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#00f0ff]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.2,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN Experience
───────────────────────────────────────────── */
const Experience = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const timelineRef = useRef(null);

  const sectionInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const headerInView = useInView(headerRef, { once: true, amount: 0.5 });
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.05 });

  const [activeIndex, setActiveIndex] = useState(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #020408, #030810, #020408)",
      }}
    >
      {/* Floating particles */}
      <FloatingParticles />

      {/* Parallax bg blobs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(0,240,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef}>
          <SectionHeader inView={headerInView} />
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Center vertical line (desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px">
            <TimelineLine inView={timelineInView} />
          </div>

          {/* Mobile left line */}
          <div className="md:hidden absolute left-5 top-0 bottom-0 w-px bg-white/[0.05]" />

          {/* Items */}
          <div className="space-y-12 md:space-y-16">
            {experienceTimeline.map((item, index) => {
              const isLeft = index % 2 === 0;
              const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
              const isActive = activeIndex === index;

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 pl-14 md:pl-0`}
                >
                  {/* Mobile dot */}
                  <div className="md:hidden absolute left-2 top-6">
                    <motion.div
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor: color.main,
                        background: isActive ? color.main : "#020408",
                        boxShadow: `0 0 10px ${color.glow}`,
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: color.main }}
                      />
                    </motion.div>
                  </div>

                  {/* Desktop: left card OR spacer */}
                  <div className="hidden md:flex w-full md:w-[46%] justify-end">
                    {isLeft ? (
                      <ExperienceCard
                        item={item}
                        index={index}
                        isLeft={true}
                        color={color}
                        isActive={isActive}
                        onHover={setActiveIndex}
                      />
                    ) : (
                      <div className="w-full" />
                    )}
                  </div>

                  {/* Desktop center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-20">
                    <MilestoneDot
                      color={color}
                      active={isActive}
                      index={index}
                    />
                  </div>

                  {/* Desktop: right card OR spacer */}
                  <div className="hidden md:flex w-full md:w-[46%]">
                    {!isLeft ? (
                      <ExperienceCard
                        item={item}
                        index={index}
                        isLeft={false}
                        color={color}
                        isActive={isActive}
                        onHover={setActiveIndex}
                      />
                    ) : (
                      <div className="w-full" />
                    )}
                  </div>

                  {/* Mobile: full-width card */}
                  <div className="md:hidden w-full">
                    <ExperienceCard
                      item={item}
                      index={index}
                      isLeft={false}
                      color={color}
                      isActive={isActive}
                      onHover={setActiveIndex}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* End cap */}
          <motion.div
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-8 flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={timelineInView ? { opacity: 1 } : {}}
            transition={{ delay: 2 }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]/60 text-xs"
              style={{ background: "rgba(0,240,255,0.04)" }}
            >
              <FaChevronDown />
            </div>
            <span className="text-[9px] font-mono text-gray-700 tracking-widest uppercase">
              More to come
            </span>
          </motion.div>
        </div>

        {/* Summary bar */}
        <SummaryBar inView={sectionInView} />
      </div>
    </section>
  );
};

export default Experience;
