import { Swap as SwapForm } from "../swap";

// TODO add quotes from all providers under swap inputs
export function Swap() {
  return (
    <div className="max-w-[600px] mx-auto mt-[-40px]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Best Price Swap
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          We find the best price for your swap among the most popular providers on Internet Computer
        </p>
      </div>
      <SwapForm className="mt-[20px]" />
    </div>
  );
}
