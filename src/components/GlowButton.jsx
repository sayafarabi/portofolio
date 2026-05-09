function GlowButton({ children, onClick, variant = "primary", href }) {
  const base =
    "relative px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer inline-flex items-center gap-2 group";
  const styles = {
    primary:
      "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)]",
    outline:
      "border border-cyan-500/60 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
  };
  const El = href ? "a" : "button";
  return (
    <El href={href} onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </El>
  );
}

export default GlowButton;
