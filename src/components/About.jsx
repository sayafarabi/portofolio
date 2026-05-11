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
import { personalInfo, aboutStats } from "../data/data";
import {
  FaDownload,
  FaEnvelope,
  FaGraduationCap,
  FaHeart,
  FaMapMarkerAlt,
  FaCoffee,
  FaUniversity,
  FaCode,
  FaRocket,
} from "react-icons/fa";
import { FiArrowRight, FiCamera, FiZap, FiStar, FiGlobe } from "react-icons/fi";

/* ═══════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @keyframes ab-ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes ab-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ab-orbit-cw { to{transform:rotate(360deg)} }
  @keyframes ab-orbit-cc { to{transform:rotate(-360deg)} }
  @keyframes ab-pulse-glow { 0%,100%{box-shadow:0 0 12px rgba(0,240,255,.3)} 50%{box-shadow:0 0 28px rgba(0,240,255,.7)} }
  @keyframes ab-scan     { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes ab-blink    { 50%{opacity:0} }
  @keyframes ab-shimmer  { 0%{transform:translateX(-110%)} 100%{transform:translateX(110%)} }
  @keyframes ab-ripple   { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.4);opacity:0} }
  @keyframes ab-bar-fill { from{width:0} }
`;

/* ═══════════════════════════════════════════════
   HOOK: Odometer counter
═══════════════════════════════════════════════ */
function useOdometer(target, inView, duration = 2000) {
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

/* ═══════════════════════════════════════════════
   COMPONENT: Section header
═══════════════════════════════════════════════ */
function SectionHeader({ tag, title, highlight }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} className="text-center mb-20">
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
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-4 mx-auto w-16 h-px bg-gradient-to-r from-[#00f0ff] to-transparent rounded-full"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Photo Gallery Carousel  ★ NEW
   Swipeable gallery — shows a DIFFERENT photo from hero
   Uses personalInfo.galleryImages[] or falls back to a
   different crop/angle of profileImage with overlay variety
═══════════════════════════════════════════════ */
const GALLERY_OVERLAYS = [
  // each overlay gives the same photo a totally different feel
  {
    label: "At Work",
    filter: "brightness(1.05) saturate(1.2)",
    tint: "rgba(0,240,255,0.08)",
  },
  {
    label: "Studio",
    filter: "grayscale(0.3) contrast(1.1)",
    tint: "rgba(99,102,241,0.12)",
  },
  {
    label: "Outdoor",
    filter: "brightness(1.1) sepia(0.15)",
    tint: "rgba(251,191,36,0.06)",
  },
  {
    label: "Focus Mode",
    filter: "contrast(1.2) saturate(0.85)",
    tint: "rgba(134,239,172,0.07)",
  },
];

function PhotoGallery() {
  const [active, setActive] = useState(0);
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const rx = useMotionValue(0),
    ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18 });

  const mv = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 12);
    rx.set(-((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 12);
  };
  const ml = () => {
    rx.set(0);
    ry.set(0);
    setHov(false);
  };

  // auto-advance
  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % GALLERY_OVERLAYS.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  const ov = GALLERY_OVERLAYS[active];
  // use gallery images if available, else profileImage
  const imgSrc =
    personalInfo.galleryImages?.[active] ?? personalInfo.profileImage;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* 3D tilt card */}
      <motion.div
        ref={ref}
        onMouseMove={mv}
        onMouseLeave={ml}
        onMouseEnter={() => setHov(true)}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          perspective: 900,
          position: "relative",
          width: 280,
          height: 320,
        }}
      >
        {/* main photo */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            overflow: "hidden",
            transform: "translateZ(0)",
          }}
          animate={{
            borderColor: hov ? "rgba(0,240,255,.55)" : "rgba(0,240,255,.2)",
          }}
          className="border-2 border-[#00f0ff]/20 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={imgSrc}
              alt={ov.label}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55 }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: ov.filter,
              }}
            />
          </AnimatePresence>

          {/* colour tint overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "absolute", inset: 0, background: ov.tint }}
            />
          </AnimatePresence>

          {/* scan line */}
          {hov && (
            <motion.div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(to right,transparent,rgba(0,240,255,.5),transparent)",
                pointerEvents: "none",
              }}
              initial={{ top: "-5%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
            />
          )}

          {/* label badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                position: "absolute",
                bottom: 14,
                left: 14,
                padding: "3px 10px",
                borderRadius: 999,
                fontSize: 10,
                fontFamily: "monospace",
                color: "#00f0ff",
                border: "1px solid rgba(0,240,255,.35)",
                background: "rgba(2,4,8,.75)",
                backdropFilter: "blur(10px)",
                letterSpacing: "0.12em",
              }}
            >
              <FiCamera
                style={{ display: "inline", marginRight: 4, fontSize: 9 }}
              />
              {ov.label}
            </motion.div>
          </AnimatePresence>

          {/* shimmer on hover */}
          {hov && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                borderRadius: 22,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "50%",
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)",
                  animation: "ab-shimmer 1.2s ease-in-out infinite",
                }}
              />
            </div>
          )}
        </motion.div>

        {/* floating depth layer */}
        <motion.div
          style={{
            position: "absolute",
            bottom: -10,
            left: "10%",
            right: "10%",
            height: 20,
            borderRadius: "50%",
            background: "rgba(0,240,255,.1)",
            filter: "blur(16px)",
            transform: "translateZ(-10px)",
          }}
        />
      </motion.div>

      {/* dot indicators */}
      <div style={{ display: "flex", gap: 8 }}>
        {GALLERY_OVERLAYS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              transition: "all .35s",
              background: i === active ? "#00f0ff" : "rgba(255,255,255,.15)",
            }}
          />
        ))}
      </div>

      {/* fun facts floating chips around the card */}
      <div className="flex flex-wrap justify-center gap-2 max-w-xs">
        {[
          "☕ Coffee addict",
          "🎯 Detail-oriented",
          "🚀 Fast learner",
          "🌙 Night owl",
        ].map((tag, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ y: -3, borderColor: "rgba(0,240,255,.45)" }}
            style={{
              padding: "3px 11px",
              borderRadius: 999,
              fontSize: 10,
              fontFamily: "monospace",
              color: "rgba(255,255,255,.5)",
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.02)",
              cursor: "default",
              transition: "all .25s",
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Typewriter quote  ★ NEW
═══════════════════════════════════════════════ */
const QUOTES = [
  "Desain estetis + performa optimal = website modern.",
  "Setiap piksel punya alasan untuk ada.",
  "Clean code is not written, it is rewritten.",
  "UI yang baik tidak terasa seperti UI.",
];
function TypewriterQuote() {
  const [qi, setQi] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.8 });

  useEffect(() => {
    if (!inView) return;
    const q = QUOTES[qi % QUOTES.length];
    let t;
    if (!del) {
      if (text.length < q.length)
        t = setTimeout(() => setText(q.slice(0, text.length + 1)), 42);
      else t = setTimeout(() => setDel(true), 2200);
    } else {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), 22);
      else {
        setDel(false);
        setQi((i) => i + 1);
      }
    }
    return () => clearTimeout(t);
  }, [text, del, qi, inView]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        padding: "18px 20px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,.06)",
        background: "rgba(255,255,255,.02)",
        overflow: "hidden",
      }}
    >
      {/* big decorative quote mark */}
      <span
        style={{
          position: "absolute",
          top: -4,
          left: 8,
          fontSize: 60,
          color: "rgba(0,240,255,.08)",
          fontFamily: "Georgia,serif",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        "
      </span>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 13,
          color: "rgba(255,255,255,.7)",
          lineHeight: 1.65,
          minHeight: 42,
          position: "relative",
          zIndex: 1,
        }}
      >
        {text}
        <span
          style={{
            display: "inline-block",
            width: 2,
            height: 14,
            background: "#00f0ff",
            verticalAlign: "middle",
            marginLeft: 2,
            animation: "ab-blink 1s step-end infinite",
          }}
        />
      </p>
      {/* shimmer top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background:
            "linear-gradient(to right,transparent,rgba(0,240,255,.5),transparent)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Highlight card (info chips)
═══════════════════════════════════════════════ */
function HighlightCard({ icon: Icon, label, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -3, borderColor: "rgba(0,240,255,.28)" }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,.06)",
        background: "rgba(255,255,255,.02)",
        transition: "all .3s",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "rgba(0,240,255,.08)",
          border: "1px solid rgba(0,240,255,.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00f0ff",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        <Icon />
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,.8)",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,.28)" }}>{sub}</div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Odometer stat pill
═══════════════════════════════════════════════ */
function StatPill({ value, label, delay, inView, color = "#00f0ff" }) {
  const count = useOdometer(value, inView, 2000);
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={{ y: -3, borderColor: color + "55" }}
      style={{
        flex: 1,
        minWidth: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 10px",
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.06)",
        background: "rgba(255,255,255,.02)",
        transition: "all .4s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          transition: "opacity .4s",
          background: `radial-gradient(circle at center,${color}08 0%,transparent 70%)`,
        }}
        className="group-hover:opacity-100"
      />
      <span
        style={{
          fontSize: 32,
          fontWeight: 900,
          fontFamily: "monospace",
          color,
          lineHeight: 1,
        }}
      >
        {count}
        <span style={{ color }}>+</span>
      </span>
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,.3)",
          textTransform: "uppercase",
          marginTop: 4,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Radial skill ring
═══════════════════════════════════════════════ */
function RadialSkill({ label, pct, delay, inView, color = "#00f0ff" }) {
  const r = 28,
    circ = 2 * Math.PI * r;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        cursor: "default",
      }}
    >
      <div style={{ position: "relative", width: 64, height: 64 }}>
        <svg
          style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
          viewBox="0 0 70 70"
        >
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
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={
              inView
                ? { strokeDashoffset: circ * (1 - pct / 100) }
                : { strokeDashoffset: circ }
            }
            transition={{ delay: delay + 0.2, duration: 1.3, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 5px ${color}90)` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              fontFamily: "monospace",
              color,
            }}
          >
            {pct}%
          </span>
        </div>
      </div>
      <span
        style={{
          fontSize: 9,
          color: "rgba(255,255,255,.4)",
          letterSpacing: "0.1em",
          textAlign: "center",
          maxWidth: 60,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Skill ticker
═══════════════════════════════════════════════ */
function SkillTicker({ items }) {
  const doubled = [...items, ...items];
  return (
    <div
      style={{ position: "relative", overflow: "hidden", padding: "10px 0" }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 48,
          background: "linear-gradient(to right,#020408,transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 48,
          background: "linear-gradient(to left,#020408,transparent)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          gap: 10,
          animation: "ab-ticker 22s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              flexShrink: 0,
              padding: "4px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.08)",
              fontSize: 11,
              fontFamily: "monospace",
              color: "rgba(255,255,255,.38)",
              background: "rgba(255,255,255,.02)",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Timeline item
═══════════════════════════════════════════════ */
function TimelineItem({
  year,
  title,
  sub,
  icon: Icon,
  delay,
  inView,
  color = "#00f0ff",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="group"
      style={{ display: "flex", gap: 14, position: "relative" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.15 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: `${color}12`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            fontSize: 14,
            flexShrink: 0,
            transition: "all .3s",
            cursor: "default",
          }}
        >
          <Icon />
        </motion.div>
        <div
          style={{
            width: 1,
            flex: 1,
            background:
              "linear-gradient(to bottom,rgba(0,240,255,.2),transparent)",
            marginTop: 6,
          }}
        />
      </div>
      <div style={{ paddingBottom: 24 }}>
        <span
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            color: `${color}80`,
            letterSpacing: "0.2em",
          }}
        >
          {year}
        </span>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(255,255,255,.85)",
            marginTop: 2,
          }}
        >
          {title}
        </p>
        <p
          style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 2 }}
        >
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Interest/hobby tags  ★ NEW
═══════════════════════════════════════════════ */
const INTERESTS = [
  { emoji: "⚛️", label: "React Ecosystem" },
  { emoji: "🎨", label: "UI/UX Design" },
  { emoji: "🌐", label: "Web Performance" },
  { emoji: "📱", label: "Mobile-first" },
  { emoji: "🤖", label: "AI Tools" },
  { emoji: "🎸", label: "Music" },
  { emoji: "📚", label: "Tech Reading" },
  { emoji: "☕", label: "Coffee" },
];
function InterestCloud() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            letterSpacing: "0.3em",
            color: "rgba(0,240,255,.45)",
            textTransform: "uppercase",
          }}
        >
          Interests
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(to right,rgba(0,240,255,.2),transparent)",
          }}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {INTERESTS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i }}
            whileHover={{
              y: -4,
              borderColor: "rgba(0,240,255,.45)",
              background: "rgba(0,240,255,.06)",
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.02)",
              fontSize: 11,
              color: "rgba(255,255,255,.5)",
              cursor: "default",
              transition: "all .25s",
            }}
          >
            <span style={{ fontSize: 13 }}>{item.emoji}</span>
            <span style={{ fontFamily: "monospace" }}>{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Availability heatmap  ★ NEW
   Fake GitHub-style weekly availability grid
═══════════════════════════════════════════════ */
const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const HEAT = [
  [3, 4, 2, 4, 4, 1, 0],
  [4, 3, 4, 2, 4, 0, 1],
  [2, 4, 4, 3, 3, 2, 0],
  [4, 4, 3, 4, 4, 1, 0],
];
const HEAT_COLORS = [
  "rgba(255,255,255,.04)",
  "rgba(0,240,255,.15)",
  "rgba(0,240,255,.3)",
  "rgba(0,240,255,.55)",
  "rgba(0,240,255,.85)",
];
function AvailabilityHeat() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontFamily: "monospace",
            letterSpacing: "0.3em",
            color: "rgba(0,240,255,.45)",
            textTransform: "uppercase",
          }}
        >
          Weekly Availability
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              "linear-gradient(to right,rgba(0,240,255,.2),transparent)",
          }}
        />
      </div>
      {/* day labels */}
      <div style={{ display: "flex", gap: 6, marginBottom: 4, marginLeft: 28 }}>
        {DAYS.map((d) => (
          <span
            key={d}
            style={{
              width: 22,
              fontSize: 8,
              fontFamily: "monospace",
              color: "rgba(255,255,255,.2)",
              textAlign: "center",
            }}
          >
            {d}
          </span>
        ))}
      </div>
      {/* grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {HEAT.map((row, wi) => (
          <div
            key={wi}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <span
              style={{
                fontSize: 8,
                fontFamily: "monospace",
                color: "rgba(255,255,255,.2)",
                width: 22,
                textAlign: "right",
              }}
            >
              W{wi + 1}
            </span>
            {row.map((lvl, di) => (
              <motion.div
                key={di}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.03 * (wi * 7 + di), type: "spring" }}
                title={`${DAYS[di]}: ${
                  [
                    "Tidak tersedia",
                    "Sedikit tersedia",
                    "Tersedia",
                    "Sangat tersedia",
                    "Penuh",
                  ][lvl]
                }`}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  background: HEAT_COLORS[lvl],
                  cursor: "pointer",
                  transition: "transform .2s",
                }}
                whileHover={{ scale: 1.25 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 8,
          marginLeft: 28,
        }}
      >
        <span
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: "rgba(255,255,255,.2)",
          }}
        >
          Kurang
        </span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div
            key={l}
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: HEAT_COLORS[l],
            }}
          />
        ))}
        <span
          style={{
            fontSize: 8,
            fontFamily: "monospace",
            color: "rgba(255,255,255,.2)",
          }}
        >
          Lebih
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Language / tool progress bars  ★ NEW
═══════════════════════════════════════════════ */
const LANG_BARS = [
  { name: "JavaScript", pct: 85, color: "#f7df1e" },
  { name: "TypeScript", pct: 72, color: "#3b82f6" },
  { name: "CSS / Tailwind", pct: 92, color: "#38bdf8" },
  { name: "React / Next.js", pct: 88, color: "#61dafb" },
  { name: "Node.js", pct: 65, color: "#86efac" },
];
function LangBars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div
      ref={ref}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {LANG_BARS.map((l, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 * i }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: "rgba(255,255,255,.65)",
              }}
            >
              {l.name}
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: l.color,
                fontWeight: 700,
              }}
            >
              {l.pct}%
            </span>
          </div>
          <div
            style={{
              height: 5,
              borderRadius: 3,
              background: "rgba(255,255,255,.05)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                borderRadius: 3,
                background: `linear-gradient(to right,${l.color}80,${l.color})`,
              }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${l.pct}%` } : {}}
              transition={{
                duration: 1.1,
                delay: 0.12 * i,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
            {inView && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  width: "40%",
                  background:
                    "linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)",
                  animation: `ab-shimmer 2s ease-in-out ${0.2 * i}s infinite`,
                }}
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENT: Background
═══════════════════════════════════════════════ */
function Background({ bgY }) {
  return (
    <motion.div
      style={{ y: bgY, position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(0,240,255,.035) 0%,transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(0,102,255,.04) 0%,transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.022,
          backgroundImage:
            "linear-gradient(rgba(0,240,255,1) 1px,transparent 1px),linear-gradient(to right,rgba(0,240,255,1) 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN ABOUT
═══════════════════════════════════════════════ */
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
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const skillRings = [
    { label: "React", pct: 88, color: "#61dafb" },
    { label: "JavaScript", pct: 82, color: "#f7df1e" },
    { label: "Tailwind", pct: 90, color: "#38bdf8" },
    { label: "UI/UX", pct: 75, color: "#a78bfa" },
    { label: "Node.js", pct: 65, color: "#86efac" },
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
      color: "#00f0ff",
    },
    {
      year: "2023 – Sekarang",
      title: "Frontend Developer",
      sub: "Freelance & proyek mandiri",
      icon: FaCode,
      color: "#a78bfa",
    },
    {
      year: "2023",
      title: "Proyek Pertama Launch",
      sub: "Website klien pertama go-live",
      icon: FaRocket,
      color: "#86efac",
    },
    {
      year: "2022",
      title: "Mulai Coding",
      sub: "HTML, CSS, JavaScript pertama kali",
      icon: FaCoffee,
      color: "#fbbf24",
    },
  ];

  const highlights = [
    {
      icon: FaMapMarkerAlt,
      label: "Bogor, Indonesia",
      sub: "Remote ready",
      delay: 0.1,
    },
    { icon: FaHeart, label: "UI/UX & OSS", sub: "Passion", delay: 0.15 },
    { icon: FaCoffee, label: "Kopi & Coding", sub: "Daily fuel", delay: 0.2 },
    {
      icon: FaUniversity,
      label: "CS Student",
      sub: "2024 – Sekarang",
      delay: 0.25,
    },
    { icon: FiGlobe, label: "Web Platform", sub: "Focus area", delay: 0.3 },
    { icon: FiZap, label: "Performance", sub: "Obsession", delay: 0.35 },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#020408" }}
    >
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
      <Background bgY={bgY} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader tag="// who i am" title="Tentang" highlight="Saya" />

        {/* ══ BLOCK 1: Photo gallery + bio ══ */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-28">
          {/* LEFT: Photo gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <PhotoGallery />
          </motion.div>

          {/* RIGHT: Bio */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* description */}
            <div
              style={{
                borderLeft: "2px solid rgba(0,240,255,.25)",
                paddingLeft: 16,
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,.6)",
                  lineHeight: 1.8,
                  fontSize: 14.5,
                }}
              >
                {personalInfo.description}
              </p>
            </div>

            {/* typewriter quote */}
            <TypewriterQuote />

            {/* highlight chips 3×2 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {highlights.map((h, i) => (
                <HighlightCard key={i} {...h} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ BLOCK 2: Stats row ══ */}
        <div ref={statsRef} style={{ marginBottom: 80 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                letterSpacing: "0.3em",
                color: "rgba(0,240,255,.45)",
                textTransform: "uppercase",
              }}
            >
              Statistik
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(to right,rgba(0,240,255,.2),transparent)",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {aboutStats.map((s, i) => (
              <StatPill
                key={i}
                value={s.value}
                label={s.label}
                delay={i * 0.15}
                inView={statsInView}
                color={["#00f0ff", "#a78bfa", "#86efac"][i % 3]}
              />
            ))}
          </div>
        </div>

        {/* ══ BLOCK 3: Skill rings + lang bars + ticker ══ */}
        <div ref={skillsRef} style={{ marginBottom: 80 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "monospace",
                letterSpacing: "0.3em",
                color: "rgba(0,240,255,.45)",
                textTransform: "uppercase",
              }}
            >
              Skills & Tools
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  "linear-gradient(to right,rgba(0,240,255,.2),transparent)",
              }}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 mb-8">
            {/* Radial rings */}
            <div
              style={{
                padding: 24,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,.05)",
                background: "rgba(255,255,255,.01)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,.28)",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Proficiency Rings
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 24,
                }}
              >
                {skillRings.map((s, i) => (
                  <RadialSkill
                    key={i}
                    label={s.label}
                    pct={s.pct}
                    delay={i * 0.1}
                    inView={skillsInView}
                    color={s.color}
                  />
                ))}
              </div>
            </div>

            {/* Lang bars */}
            <div
              style={{
                padding: 24,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,.05)",
                background: "rgba(255,255,255,.01)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,.28)",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Language Proficiency
              </p>
              <LangBars />
            </div>
          </div>

          {/* tech ticker */}
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,.06)",
              background: "rgba(255,255,255,.01)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 16px 4px",
                fontSize: 9,
                fontFamily: "monospace",
                letterSpacing: "0.3em",
                color: "rgba(255,255,255,.22)",
                textTransform: "uppercase",
              }}
            >
              Tech Stack
            </div>
            <SkillTicker items={techStack} />
          </div>
        </div>

        {/* ══ BLOCK 4: Interests + Heatmap ══ */}
        <div className="grid lg:grid-cols-2 gap-10 mb-20">
          <div
            style={{
              padding: 24,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,.05)",
              background: "rgba(255,255,255,.01)",
            }}
          >
            <InterestCloud />
          </div>
          <div
            style={{
              padding: 24,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,.05)",
              background: "rgba(255,255,255,.01)",
            }}
          >
            <AvailabilityHeat />
          </div>
        </div>

        {/* ══ BLOCK 5: Timeline + CTA ══ */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Timeline */}
          <div ref={timelineRef}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  letterSpacing: "0.3em",
                  color: "rgba(0,240,255,.45)",
                  textTransform: "uppercase",
                }}
              >
                Perjalanan
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background:
                    "linear-gradient(to right,rgba(0,240,255,.2),transparent)",
                }}
              />
            </div>
            {timeline.map((item, i) => (
              <TimelineItem
                key={i}
                {...item}
                delay={i * 0.15}
                inView={timelineInView}
              />
            ))}
          </div>

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              position: "relative",
              padding: 32,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,.08)",
              background: "rgba(255,255,255,.02)",
              overflow: "hidden",
            }}
            whileHover={{ borderColor: "rgba(0,240,255,.22)" }}
          >
            {/* top glow line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{
                position: "absolute",
                top: 0,
                left: 32,
                right: 32,
                height: 1,
                background:
                  "linear-gradient(to right,transparent,rgba(0,240,255,.6),transparent)",
              }}
            />

            <p
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.3em",
                color: "rgba(0,240,255,.55)",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Let's connect
            </p>
            <h3
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "white",
                marginBottom: 10,
              }}
            >
              Siap Berkolaborasi?
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,.38)",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              Terbuka untuk peluang freelance, kolaborasi proyek, maupun diskusi
              seputar teknologi dan desain.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <motion.a
                href={personalInfo.cvLink || "#"}
                download
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 20px",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#000",
                  background: "linear-gradient(135deg,#00f0ff,#0066ff)",
                  boxShadow: "0 0 24px rgba(0,240,255,.25)",
                }}
              >
                <FaDownload style={{ fontSize: 12 }} />
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 20px",
                  borderRadius: 14,
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#00f0ff",
                  border: "1px solid rgba(0,240,255,.3)",
                  background: "transparent",
                  transition: "all .3s",
                }}
              >
                <FaEnvelope style={{ fontSize: 12 }} />
                Hubungi Saya
              </motion.a>
            </div>

            {/* social proof */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,.05)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ display: "flex" }}>
                {["🧑‍💻", "👩‍🎨", "🧑‍🚀"].map((a, i) => (
                  <div
                    key={i}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(0,240,255,.1)",
                      border: "2px solid rgba(0,240,255,.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      marginLeft: i === 0 ? 0 : -8,
                      zIndex: 3 - i,
                    }}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar
                      key={i}
                      style={{ color: "#fbbf24", fontSize: 9, fill: "#fbbf24" }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.28)" }}>
                  Dipercaya{" "}
                  <span style={{ color: "rgba(0,240,255,.65)" }}>
                    4+ kolaborator
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#4ade80",
                    animation: "ab-ripple 2s ease-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    fontFamily: "monospace",
                    color: "rgba(255,255,255,.3)",
                  }}
                >
                  Available now
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
