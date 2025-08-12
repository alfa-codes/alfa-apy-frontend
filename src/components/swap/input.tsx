import clsx from "clsx";
import { Input as InputUi, InputProps, Dropdown } from "../ui";

export function Input({
  className,
  tokens,
  token,
  usdValue,
  balance,
  onTokenChange,
  ...props
}: InputProps & {
  token: { icon: string; label: string; value: string };
  tokens: Array<{ icon: string; label: string; value: string }>;
  onTokenChange: (token: string) => unknown;
  usdValue: string;
  balance: string;
}) {
  return (
    <div className={clsx("relative w-full", className)}>
      <InputUi
        className="px-4 pt-4 pb-16 w-full text-lg"
        {...props}
      />
      
      {/* Token Dropdown */}
      <div className="absolute right-3 top-3">
        {tokens.length > 0 && (
          <Dropdown
            values={tokens}
            value={token.value}
            onChange={onTokenChange}
          />
        )}
      </div>
      
      {/* Balance and USD Info */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between text-sm">
        {token && (
          <>
            <span className="text-gray-600 dark:text-green-400">
              {usdValue}
            </span>
            <span className="text-gray-600 dark:text-green-400">
              Balance: {balance} {token.label}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
