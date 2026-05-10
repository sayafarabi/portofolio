import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-scroll";
import { FiDownload, FiMail } from "react-icons/fi";
import { personalInfo } from "../data/data";

/* ─────────────────────────────────────────────
   HOOK: Scramble Text (Matrix-style reveal)
───────────────────────────────────────────── */
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
function useScramble(target, { duration = 1200, delay = 0 } = {}) {
  const [display, setDisplay] = useState(() => target.replace(/./g, CHARS[0]));
  const raf = useRef(null);

  useEffect(() => {
    let start = null;
    const timeout = setTimeout(() => {
      const tick = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const revealCount = Math.floor(progress * target.length);
        setDisplay(
          target
            .split("")
            .map((ch, i) =>
              i < revealCount
                ? ch
                : ch === " "
                ? " "
                : CHARS[Math.floor(Math.random() * CHARS.length)]
            )
            .join("")
        );
        if (progress < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration, delay]);

  return display;
}

/* ─────────────────────────────────────────────
   HOOK: Typing Effect
───────────────────────────────────────────── */
function useTypingEffect(words, speed = 80, pause = 1800) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx % words.length];
    let timeout;
    if (!deleting) {
      if (text.length < word.length) {
        timeout = setTimeout(
          () => setText(word.slice(0, text.length + 1)),
          speed
        );
      } else {
        timeout = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), speed / 2);
      } else {
        setDeleting(false);
        setIdx((i) => i + 1);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words, speed, pause]);

  return text;
}

/* ─────────────────────────────────────────────
   COMPONENT: Constellation Canvas (WebGL-lite)
───────────────────────────────────────────── */
function ConstellationCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const nodes = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const COUNT = Math.floor((W * H) / 14000);
    nodes.current = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    const LINK_DIST = 130;
    const MOUSE_DIST = 180;
    const NEON = "0,240,255";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      nodes.current.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        // Mouse repulsion
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (1 - dist / MOUSE_DIST) * 1.5;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }
      });

      // Draw lines between nearby nodes
      for (let i = 0; i < nodes.current.length; i++) {
        for (let j = i + 1; j < nodes.current.length; j++) {
          const a = nodes.current[i];
          const b = nodes.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${NEON},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // Lines to mouse
        const n = nodes.current[i];
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST) {
          const alpha = (1 - d / MOUSE_DIST) * 0.7;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${NEON},${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        }
      }

      // Draw dots
      nodes.current.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NEON},0.7)`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${NEON},0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Magnetic Button
───────────────────────────────────────────── */
function MagneticButton({ children, className, onClick, href, download }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? motion.a : motion.button;
  return (
    <Tag
      ref={ref}
      href={href}
      download={download}
      onClick={onClick}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: 3D Tilt Profile Card
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   COMPONENT: 3D Tilt Profile Card with Enhanced Animations
───────────────────────────────────────────── */
function TiltCard({ src, alt }) {
  const cardRef = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 150, damping: 20 });
  const sRotY = useSpring(rotY, { stiffness: 150, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);
  const glowOpacity = useMotionValue(0.3);

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 18);
    rotX.set(-((e.clientY - cy) / (rect.height / 2)) * 18);
  };
  const handleLeave = () => {
    rotX.set(0);
    rotY.set(0);
    setIsHovered(false);
  };
  const handleEnter = () => {
    setIsHovered(true);
  };

  // Spring untuk glow effect
  const springGlow = useSpring(glowOpacity, { stiffness: 200, damping: 20 });

  useEffect(() => {
    if (isHovered) {
      glowOpacity.set(0.8);
    } else {
      glowOpacity.set(0.3);
    }
  }, [isHovered, glowOpacity]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="relative w-44 h-44 md:w-52 md:h-52 cursor-pointer group"
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Outer glow yang berdenyut */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.6) 0%, rgba(0,102,255,0) 80%)",
          opacity: springGlow,
        }}
      />

      {/* Glow ring outer (berputar) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #00f0ff, #0066ff, #00f0ff)",
          padding: 2,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: isHovered ? 3 : 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner content */}
      <div
        className="absolute inset-[3px] rounded-full overflow-hidden"
        style={{ transform: "translateZ(20px)" }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
        
        {/* Shimmer overlay (animasi berjalan) */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,240,255,0.08) 100%)",
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Lens flare effect saat hover */}
        {isHovered && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Efek scan line vertikal yang bergerak saat hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,240,255,0.3), transparent)",
              width: "50%",
              height: "100%",
              transform: "skewX(-20deg)",
            }}
          />
        )}
      </div>

      {/* Floating status (tetap ada) */}
      <motion.div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-mono tracking-widest text-green-300 border border-green-400/40 bg-black/60 backdrop-blur-md"
        style={{ transform: "translateZ(30px)" }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ● AVAILABLE
      </motion.div>

      {/* Tooltip yang muncul saat hover (opsional) */}
      <motion.div
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono text-[#00f0ff] border border-[#00f0ff]/40 whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        style={{ transform: "translateZ(40px)" }}
      >
        ✨ {alt} ✨
      </motion.div>
    </motion.div>
  );
}
/* ─────────────────────────────────────────────
   COMPONENT: Glitch Text
───────────────────────────────────────────── */
function GlitchText({ text, className }) {
  return (
    <span className={`relative inline-block ${className}`} data-text={text}>
      {text}
      <style>{`
        .glitch-text { animation: glitch 4s infinite; }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 100%;
        }
        .glitch-text::before {
          color: #ff003c;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          animation: glitch-before 4s infinite;
        }
        .glitch-text::after {
          color: #00f0ff;
          clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%);
          animation: glitch-after 4s infinite;
        }
        @keyframes glitch {
          0%,90%,100% { transform: none; }
          91% { transform: skewX(-1deg); }
          93% { transform: skewX(1deg); }
          95% { transform: none; }
        }
        @keyframes glitch-before {
          0%,90%,100% { transform: none; opacity: 0; }
          91% { transform: translate(-3px, 1px); opacity: 0.8; }
          93% { transform: translate(3px, -1px); opacity: 0.8; }
          95% { opacity: 0; }
        }
        @keyframes glitch-after {
          0%,90%,100% { transform: none; opacity: 0; }
          91% { transform: translate(3px, 1px); opacity: 0.8; }
          93% { transform: translate(-3px, -1px); opacity: 0.8; }
          95% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Noise + Scan Line Overlay
───────────────────────────────────────────── */
function AtmosphereOverlay() {
  return (
    <>
      {/* CRT Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          backgroundSize: "100% 4px",
        }}
      />
      {/* Noise grain */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Custom Cursor
───────────────────────────────────────────── */
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const trailY = useSpring(cursorY, { stiffness: 80, damping: 20 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{ scale: clicked ? 0.5 : 1 }}
          className="w-2 h-2 rounded-full bg-[#00f0ff]"
          style={{ boxShadow: "0 0 8px #00f0ff" }}
        />
      </motion.div>
      {/* Trail ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          animate={{ scale: clicked ? 1.5 : 1, opacity: clicked ? 0.3 : 0.6 }}
          className="w-9 h-9 rounded-full border border-[#00f0ff]/60"
        />
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Liquid Morph Background Blobs
───────────────────────────────────────────── */
function LiquidBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blob-filter">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="40"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10"
              result="goo"
            />
          </filter>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g filter="url(#blob-filter)">
          <motion.ellipse
            cx="25%"
            cy="35%"
            rx="180"
            ry="150"
            fill="url(#g1)"
            animate={{
              cx: ["25%", "35%", "20%", "25%"],
              cy: ["35%", "28%", "42%", "35%"],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.ellipse
            cx="75%"
            cy="65%"
            rx="220"
            ry="180"
            fill="url(#g2)"
            animate={{
              cx: ["75%", "65%", "80%", "75%"],
              cy: ["65%", "72%", "58%", "65%"],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
          <motion.ellipse
            cx="50%"
            cy="80%"
            rx="160"
            ry="130"
            fill="url(#g1)"
            animate={{
              cx: ["50%", "58%", "44%", "50%"],
              cy: ["80%", "72%", "85%", "80%"],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6,
            }}
          />
        </g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT: Stat Counter
───────────────────────────────────────────── */
function AnimatedStat({ value, label, suffix, delay }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 1;
        setCount(start);
        if (start < target) setTimeout(step, 40);
      };
      step();
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 + 0.5 }}
      className="group relative px-6 py-4 border border-white/[0.07] rounded-2xl bg-white/[0.02] backdrop-blur-sm hover:border-[#00f0ff]/30 hover:bg-white/[0.04] transition-all duration-500"
    >
      <div className="text-3xl font-black text-[#00f0ff] font-mono tracking-tight">
        {count}+
      </div>
      <div className="text-[10px] tracking-[0.2em] text-gray-500 uppercase mt-0.5">
        {label}
      </div>
      <div className="text-[10px] text-gray-600">{suffix}</div>
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00f0ff]/50 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#00f0ff]/50 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────── */
const Hero = () => {
  const typedText = useTypingEffect([
    "Frontend Developer",
    "React Developer",
    "CS Student",
  ]);

// fitur di nonaktifkan 

  // const scrambledName = useScramble(personalInfo.name, {
  //   duration: 160,
  //   delay: 50,
  // });

  const stats = [
    { label: "Pengalaman", value: "2", suffix: "tahun", delay: 800 },
    { label: "Proyek", value: "15", suffix: "selesai", delay: 1000 },
    { label: "Teknologi", value: "10", suffix: "dikuasai", delay: 1200 },
  ];

  return (
    <>
      <CustomCursor />

      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "#020408" }}
      >
        {/* Base grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,240,255,1) 1px, transparent 1px), linear-gradient(to right, rgba(0,240,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Liquid blobs */}
        <LiquidBlobs />

        {/* Interactive constellation */}
        <ConstellationCanvas />

        {/* Atmosphere overlays */}
        <AtmosphereOverlay />

        {/* Main content */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            {/* LEFT: Text content */}
            <div className="flex-1 text-left max-w-2xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#00f0ff]/25 bg-[#00f0ff]/[0.06] backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-mono tracking-[0.25em] text-[#00f0ff]/80 uppercase">
                  Open to Opportunities
                </span>
              </motion.div>

              {/* Name Rafi Achmad Farabi */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              >
                <p className="text-xs font-mono tracking-[0.4em] text-gray-500 uppercase mb-2">
                  Halo, Saya
                </p>
                <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-2">
                  <span className="bg-gradient-to-r from-white via-white to-[#00f0ff] bg-clip-text text-transparent">
                    {personalInfo.name}
                  </span>
                </h1>
              </motion.div>

              {/* Typing role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 h-10 flex items-center"
              >
                <span className="text-xl md:text-2xl font-mono text-[#00f0ff]/70">
                  &gt;_ {typedText}
                  <span
                    className="ml-0.5 inline-block w-[2px] h-5 bg-[#00f0ff] align-middle"
                    style={{ animation: "blink 1s step-end infinite" }}
                  />
                </span>
                <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-gray-400 leading-relaxed max-w-lg text-sm md:text-base border-l-2 border-[#00f0ff]/20 pl-4"
              >
                {personalInfo.description}
              </motion.p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap gap-3">
                {stats.map((s, i) => (
                  <AnimatedStat key={i} {...s} />
                ))}
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                {/* Primary: Magnetic download */}
                <MagneticButton
                  href={personalInfo.cvLink}
                  download
                  className="relative group px-8 py-3.5 rounded-full font-bold text-sm text-black overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #00f0ff, #0066ff)",
                    boxShadow: "0 0 30px rgba(0,240,255,0.3)",
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <FiDownload className="text-base" />
                    Download CV
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.15 }}
                  />
                </MagneticButton>

                {/* Secondary: Magnetic contact */}
                <Link to="contact" smooth spy duration={600} offset={-70}>
                  <MagneticButton className="relative group px-8 py-3.5 rounded-full font-bold text-sm text-[#00f0ff] border border-[#00f0ff]/40 overflow-hidden backdrop-blur-sm hover:border-[#00f0ff]/80 transition-colors duration-300">
                    <span className="relative z-10 flex items-center gap-2">
                      <FiMail className="text-base" />
                      Contact Me
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-[#00f0ff]"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.07 }}
                    />
                  </MagneticButton>
                </Link>
              </motion.div>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-10 flex items-center gap-1"
              >
                <span className="text-[10px] font-mono tracking-widest text-gray-600 mr-3 uppercase">
                  Find me
                </span>
                <div className="flex gap-2">
                  {personalInfo.socialLinks.map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className="w-10 h-10 rounded-xl border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 hover:bg-[#00f0ff]/[0.06] transition-all duration-300 text-lg"
                      whileHover={{ y: -4, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                    >
                      <s.icon />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT: 3D tilt profile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                type: "spring",
                stiffness: 80,
              }}
              className="flex-shrink-0 flex flex-col items-center gap-8"
            >
              {/* 3D tilt photo */}
              <TiltCard
                src={personalInfo.profileImage}
                alt={personalInfo.name}
              />

              {/* Terminal-style card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="w-64 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-md overflow-hidden"
                style={{ boxShadow: "0 0 40px rgba(0,0,0,0.5)" }}
              >
                {/* Terminal header */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-[10px] font-mono text-gray-600">
                    profile.html
                  </span>
                </div>
                {/* Terminal body */}
                <div className="p-4 font-mono text-[11px] space-y-1">
                  <div>
                    <span className="text-[#00f0ff]/60">name</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-green-300">
                      "{personalInfo.name}"
                    </span>
                  </div>
                  <div>
                    <span className="text-[#00f0ff]/60">role</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-yellow-300">"Frontend Dev"</span>
                  </div>
                  <div>
                    <span className="text-[#00f0ff]/60">status</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-green-400">"available"</span>
                  </div>
                  <div>
                    <span className="text-[#00f0ff]/60">location</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-blue-300">"Indonesia"</span>
                  </div>
                  <div>
                    <span className="text-[#00f0ff]/60">coffee</span>
                    <span className="text-gray-600">: </span>
                    <span className="text-orange-300">true</span>
                    <span className="text-gray-600"> ☕</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-[9px] font-mono tracking-[0.4em] text-gray-600 uppercase">
            Scroll
          </span>
          <Link to="about" smooth spy offset={-70} className="cursor-pointer">
            <div className="w-5 h-8 rounded-full border border-white/[0.12] flex justify-center pt-1.5 hover:border-[#00f0ff]/40 transition-colors">
              <motion.div
                className="w-0.5 h-2 rounded-full bg-[#00f0ff]"
                animate={{ opacity: [1, 0.2, 1], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </Link>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
