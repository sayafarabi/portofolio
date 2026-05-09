import { FiSun, FiMoon } from "react-icons/fi";
import { useDarkMode } from "../hooks/useDarkMode";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full glass hover:glow-neon-hover transition-all"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <FiSun className="text-yellow-400 text-lg" />
      ) : (
        <FiMoon className="text-gray-300 text-lg" />
      )}
    </button>
  );
};

export default ThemeToggle;
