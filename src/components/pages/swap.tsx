import { Swap as SwapForm } from "../swap";
import { useTheme } from "../../contexts/ThemeContext";

// TODO add quotes from all providers under swap inputs
export function Swap() {
  const { theme } = useTheme();
  return (
    <div className="max-w-[600px] mx-auto mt-[-40px]">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-gray-900'}`}>
          Best Price Swap
        </h2>
        <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-green-300' : 'text-gray-600'}`}>
          We find the best price for your swap among the most popular providers on Internet Computer
        </p>
      </div>
      <SwapForm className="mt-[20px]" />
    </div>
  );
}
