import { Strategies as StrategiesList } from "../strategies";
import { useTheme } from "../../contexts/ThemeContext";

export function Strategies() {
  const { theme } = useTheme();
  
  return (
    <div className={`w-full max-w-[1400px] mx-auto ${
      theme === 'dark' ? 'text-green-400' : 'text-gray-900'
    }`}>
      <StrategiesList />
    </div>
  );
}
