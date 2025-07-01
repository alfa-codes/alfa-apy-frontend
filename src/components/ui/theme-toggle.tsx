import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      style={{
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fbbf24',
      }}
    >
      <span
        className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200"
        style={{
          transform: theme === 'dark' ? 'translateX(2rem)' : 'translateX(0.25rem)',
        }}
      />
      <span className="absolute left-2 text-xs">☀️</span>
      <span className="absolute right-2 text-xs">🌙</span>
    </button>
  );
} 