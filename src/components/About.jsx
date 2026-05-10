import { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { personalInfo, aboutStats } from "../data/data";
import {
  FaDownload,
  FaEnvelope,
  FaGraduationCap,
  FaHeart,
  FaMapMarkerAlt,
  FaCoffee,
  FaUniversity,
} from "react-icons/fa";
import { fadeIn, staggerContainer } from "../animations";

/* ─────────────────────────────────────────────
   HOOK: Number Odometer (ticker style)
───────────────────────────────────────────── */
function useOdometer(target, inView, duration = 2200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return val;
}

/* ─────────────────────────────────────────────
   COMPONENT: Stat Pill (odometer style)
───────────────────────────────────────────── */
function StatPill({ value, label, delay, inView }) {
  const count = useOdometer(value, inView, 2000);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#00f0ff]/30 hover:bg-[#00f0ff]/[0.03] transition-all duration-500 overflow-hidden"
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,240,255,0.06) 0%, transparent 70%)",
        }}
      />
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#00f0ff]/0 group-hover:border-[#00f0ff]/50 rounded-tl-2xl transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#00f0ff]/0 group-hover:border-[#00f0ff]/50 rounded-br-2xl transition-all duration-300" />

      <span className="text-4xl font-black font-mono text-white tabular-nums leading-none">
        {count}
        <span className="text-[#00f0ff]">+</span>
      </span>
      <span className="mt-1.5 text-[10px] tracking-[0.2em] text-gray-500 uppercase text-center">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Horizontal Scrolling Ticker
───────────────────────────────────────────── */
function SkillTicker({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-3">
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, #020408, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #020408, transparent)" }}
      />
      <motion.div
        className="flex gap-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex-shrink-0 px-4 py-1.5 rounded-full border border-white/[0.08] text-[11px] font-mono text-gray-400 bg-white/[0.02] whitespace-nowrap hover:border-[#00f0ff]/40 hover:text-[#00f0ff] transition-colors cursor-default"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Radial skill chart (CSS only)
───────────────────────────────────────────── */
function RadialBar({ label, pct, delay, inView }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = inView ? circ * (1 - pct / 100) : circ;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="flex flex-col items-center gap-2 group"
    >
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
          <circle
            cx="35"
            cy="35"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="5"
          />
          <motion.circle
            cx="35"
            cy="35"
            r={r}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={
              inView ? { strokeDashoffset: dash } : { strokeDashoffset: circ }
            }
            transition={{ delay: delay + 0.2, duration: 1.2, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 4px rgba(0,240,255,0.7))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-black font-mono text-white">
            {pct}%
          </span>
        </div>
      </div>
      <span className="text-[10px] text-gray-500 tracking-wider text-center">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Timeline Item
───────────────────────────────────────────── */
function TimelineItem({ year, title, sub, icon: Icon, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="relative flex gap-4 group"
    >
      {/* Line */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/[0.08] border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] text-sm flex-shrink-0 group-hover:bg-[#00f0ff]/20 transition-colors">
          <Icon />
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-[#00f0ff]/20 to-transparent mt-2" />
      </div>
      <div className="pb-6">
        <span className="text-[10px] font-mono text-[#00f0ff]/60 tracking-widest">
          {year}
        </span>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Profile Image with orbital rings
───────────────────────────────────────────── */
function OrbitalProfile({ src, alt }) {
  return (
    <div className="relative w-52 h-52 md:w-64 md:h-64 mx-auto">
      {/* Orbit ring 1 */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[#00f0ff]/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ borderStyle: "dashed" }}
      >
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#00f0ff]"
          style={{ boxShadow: "0 0 10px #00f0ff" }}
        />
      </motion.div>
      {/* Orbit ring 2 */}
      <motion.div
        className="absolute inset-5 rounded-full border border-blue-500/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ borderStyle: "dashed" }}
      >
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400"
          style={{ boxShadow: "0 0 8px #60a5fa" }}
        />
      </motion.div>
      {/* Photo */}
      <div
        className="absolute inset-10 rounded-full overflow-hidden border-2 border-[#00f0ff]/40"
        style={{
          boxShadow:
            "0 0 40px rgba(0,240,255,0.15), inset 0 0 20px rgba(0,240,255,0.05)",
        }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,240,255,0.07) 0%, transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}

   // COMPONENT: Section Header

function SectionHeader({ tag, title, highlight }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="inline-block text-[11px] font-mono tracking-[0.35em] text-[#00f0ff]/70 uppercase mb-4 px-4 py-1.5 border border-[#00f0ff]/20 rounded-full bg-[#00f0ff]/[0.04]"
      >
        {tag}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
        className="text-4xl md:text-5xl font-black tracking-tight"
      >
        <span className="text-white">{title} </span>
        <span className="bg-gradient-to-r from-[#00f0ff] to-blue-400 bg-clip-text text-transparent">
          {highlight}
        </span>
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-[#00f0ff] to-transparent rounded-full"
      />
    </div>
  );
}

  // MAIN ABOUT

const About = () => {
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const skillsInView = useInView(skillsRef, { once: true, amount: 0.3 });
  const timelineInView = useInView(timelineRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const skills = [
    { label: "React", pct: 88 },
    { label: "JavaScript", pct: 82 },
    { label: "CSS / Tailwind", pct: 90 },
    { label: "UI/UX", pct: 75 },
    { label: "Node.js", pct: 65 },
  ];

  const techStack = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Node.js",
    "Git",
    "Figma",
    "REST API",
    "PostgreSQL",
    "Vite",
    "Three.js",
  ];

  const timeline = [
    {
      year: "2024 – Sekarang",
      title: "S1 Ilmu Komputer",
      sub: "Universitas — Aktif kuliah",
      icon: FaGraduationCap,
    },
    {
      year: "2023 – Sekarang",
      title: "Frontend Developer",
      sub: "Freelance & proyek mandiri",
      icon: FaHeart,
    },
    {
      year: "2022",
      title: "Mulai Coding",
      sub: "HTML, CSS, JavaScript pertama kali",
      icon: FaCoffee,
    },
  ];

  const highlights = [
    { icon: FaMapMarkerAlt, label: "Bogor, Indonesia", sub: "Remote ready" },
    { icon: FaHeart, label: "UI/UX & Open Source", sub: "Passion" },
    { icon: FaCoffee, label: "Kopi & Coding", sub: "Fuel" },
    { icon: FaUniversity, label: "CS Student", sub: "2024 – Sekarang" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020408" }}
    >
      {/* Animated background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,240,255,0.04) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96"
          style={{
            background:
              "radial-gradient(circle, rgba(0,102,255,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(0,240,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader tag="// who i am" title="Tentang" highlight="Saya" />

        {/* ── BLOCK 1: Profile + Bio ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: orbital profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <OrbitalProfile
              src={personalInfo.profileImage}
              alt={personalInfo.name}
            />
          </motion.div>

          {/* Right: bio text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Quote bar */}
            <div className="relative pl-5 border-l-2 border-[#00f0ff]/30">
              <p className="text-gray-300 leading-relaxed text-base">
                {personalInfo.description}
              </p>
            </div>

            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06] italic text-gray-400 text-sm"
            >
              <span className="absolute -top-3 -left-1 text-4xl text-[#00f0ff]/20 font-serif leading-none">
                "
              </span>
              Desain estetis, interaksi halus, dan performa optimal adalah kunci
              website modern yang berkesan.
              <span className="absolute -bottom-5 right-2 text-4xl text-[#00f0ff]/20 font-serif leading-none">
                "
              </span>
            </motion.blockquote>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-2.5">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#00f0ff]/25 hover:bg-[#00f0ff]/[0.03] transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/[0.08] border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] text-xs group-hover:bg-[#00f0ff]/20 transition-colors flex-shrink-0">
                    <item.icon />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium truncate">
                      {item.label}
                    </p>
                    <p className="text-gray-600 text-[10px]">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── BLOCK 2: Stats ── */}
        <div ref={statsRef} className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] font-mono tracking-[0.3em] text-[#00f0ff]/50 uppercase">
              Statistik
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00f0ff]/20 to-transparent" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {aboutStats.map((stat, i) => (
              <StatPill
                key={i}
                value={stat.value}
                label={stat.label}
                delay={i * 0.15}
                inView={statsInView}
              />
            ))}
          </div>
        </div>

        {/* ── BLOCK 3: Skills radar ── */}
        <div ref={skillsRef} className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[11px] font-mono tracking-[0.3em] text-[#00f0ff]/50 uppercase">
              Skills
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00f0ff]/20 to-transparent" />
          </div>

          {/* Radial bars */}
          <div className="flex flex-wrap justify-center gap-8 mb-8 p-6 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
            {skills.map((s, i) => (
              <RadialBar
                key={i}
                label={s.label}
                pct={s.pct}
                delay={i * 0.12}
                inView={skillsInView}
              />
            ))}
          </div>

          {/* Tech ticker */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.01] overflow-hidden">
            <div className="px-4 pt-3 pb-1 text-[9px] font-mono tracking-[0.3em] text-gray-600 uppercase">
              Tech Stack
            </div>
            <SkillTicker items={techStack} />
          </div>
        </div>

        {/* ── BLOCK 4: Timeline + CTA ── */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Timeline */}
          <div ref={timelineRef}>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[11px] font-mono tracking-[0.3em] text-[#00f0ff]/50 uppercase">
                Perjalanan
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#00f0ff]/20 to-transparent" />
            </div>
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <TimelineItem
                  key={i}
                  {...item}
                  delay={i * 0.15}
                  inView={timelineInView}
                />
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden group"
          >
            {/* Animated border glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
              style={{ boxShadow: "inset 0 0 40px rgba(0,240,255,0.05)" }}
            />
            {/* Top accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent"
            />

            <p className="text-[11px] font-mono tracking-[0.3em] text-[#00f0ff]/60 uppercase mb-3">
              Let's connect
            </p>
            <h3 className="text-2xl font-black text-white mb-3">
              Siap Berkolaborasi?
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Terbuka untuk peluang freelance, kolaborasi proyek, maupun diskusi
              seputar teknologi dan desain.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.a
                href={personalInfo.cvLink || "#"}
                download
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-black"
                style={{
                  background: "linear-gradient(135deg, #00f0ff, #0066ff)",
                  boxShadow: "0 0 24px rgba(0,240,255,0.25)",
                }}
              >
                <FaDownload className="text-xs" />
                Download CV
              </motion.a>
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/[0.06] transition-all duration-300"
              >
                <FaEnvelope className="text-xs" />
                Hubungi Saya
              </motion.a>
            </div>

            {/* Status indicator */}
            <div className="mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-mono text-gray-600">
                Currently available for work
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
