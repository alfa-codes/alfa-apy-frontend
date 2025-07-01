import clsx from "clsx";
import { useTheme } from "../contexts/ThemeContext";

export function Footer({ className }: { className?: string }) {
  const { theme } = useTheme();
  
  return (
    <div
      className={clsx(
        className,
        "flex justify-between py-[20px] md:py-[30px]",
        theme === 'dark' ? 'text-green-300' : 'text-gray-600'
      )}
    >
      <span>© 2025 AlphaAPY. All rights reserved.</span>
    </div>
  );
}
