import clsx from "clsx";
import { Button as PixelButton, ButtonProps } from "pixel-retroui";
import { useState } from "react";
import colors from "tailwindcss/colors";
import CircleLoader from "react-spinners/MoonLoader";
import { useTheme } from "../../contexts/ThemeContext";

export function Button({
  className,
  loading,
  shadowColor,
  ...props
}: ButtonProps & { loading?: boolean; disabled?: boolean; shadowColor?: string }) {
  const disabled = loading || props.disabled;
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  // Dark theme colors
  const darkBg = props.bg || (theme === 'dark' ? colors.purple[600] : colors.amber[400]);
  const darkHoverBg = theme === 'dark' ? colors.purple[700] : colors.amber[500];
  const darkHoverShadow = theme === 'dark' ? colors.purple[900] : colors.amber[700];
  const darkTextColor = theme === 'dark' ? colors.white : colors.black;

  return (
    <PixelButton
      {...props}
      className={clsx(
        "m-0 cursor-pointer transition-all duration-200 ease-in-out flex items-center",
        { "cursor-disabled": isDisabled },
        className
      )}
      bg={
        isDisabled
          ? colors.gray[300]
          : hovered
          ? darkHoverBg
          : darkBg
      }
      shadow={shadowColor || (isDisabled ? colors.gray[500] : darkHoverShadow)}
      textColor={darkTextColor}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex w-full items-center justify-center">
        {loading && (
          <CircleLoader
            className="mr-[5px]"
            color={darkTextColor}
            loading={true}
            size={15}
          />
        )}
        {props.children}
      </div>
    </PixelButton>
  );
}
