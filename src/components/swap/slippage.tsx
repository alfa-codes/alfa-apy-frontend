import { Popup, PopupProps } from "pixel-retroui";
import { Button, Input } from "../ui";
import clsx from "clsx";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export function SlippageModal({
  onSlippageChange,
  ...props
}: Omit<PopupProps, "children"> & {
  onSlippageChange: (slippage: string) => unknown;
}) {
  const [value, setValue] = useState("2");
  const { theme } = useTheme();
  return (
    <Popup {...props} className={clsx("modal", props.className, theme === 'dark' && 'bg-[#232136] text-green-400 border-2 border-purple-600') }>
      <h2 className="text-[18px] sm:text-[20px] mb-[35px] sm:mb-[45px]">
        Set custom slippage
      </h2>
      <div className="flex flex-col sm:flex-row">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className="flex-1"
          type="number"
          min={0.1}
          max={50}
        />
        <Button
          className="sm:ml-[20px] sm:h-[40px] w-full sm:w-auto sm:h-[42px] mt-[25px] sm:mt-0"
          onClick={() => onSlippageChange(value)}
          bg={theme === 'dark' ? '#a78bfa' : undefined}
          textColor={theme === 'dark' ? '#22ff88' : undefined}
        >
          Confirm
        </Button>
      </div>
    </Popup>
  );
}
