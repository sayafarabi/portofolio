import { motion } from "framer-motion";

function GlowButton({
  children,
  onClick,
  variant = "primary",
  href,
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
}) {
  // Gaya dasar tombol
  const baseStyles =
    "relative font-semibold rounded-full transition-all duration-300 inline-flex items-center justify-center gap-2 group overflow-hidden select-none";

  // Ukuran
  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-7 py-3 text-sm",
    lg: "px-9 py-4 text-base",
  };

  // Varian warna & efek
  const variantStyles = {
    primary:
      "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]",
    secondary:
      "border border-cyan-500/60 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    danger:
      "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
  };

  // Full width
  const fullWidthStyles = fullWidth ? "w-full" : "";

  // Disabled
  const disabledStyles = disabled
    ? "opacity-50 pointer-events-none cursor-not-allowed"
    : "cursor-pointer";

  const Component = motion(href ? "a" : "button");

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidthStyles} ${disabledStyles} ${className}`}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
    >
      {/* Efek shimmer bergerak saat hover */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {/* Lingkaran pulse untuk varian primary (opsional) */}
      {variant === "primary" && (
        <span className="absolute -inset-[3px] rounded-full bg-cyan-400/20 blur-md animate-pulse pointer-events-none" />
      )}

      {/* Konten */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Component>
  );
}

export default GlowButton;
