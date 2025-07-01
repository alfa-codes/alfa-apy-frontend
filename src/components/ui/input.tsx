import clsx from "clsx";
import { Input as PixelInput, InputProps } from "pixel-retroui";
import colors from "tailwindcss/colors";
import { useTheme } from "../../contexts/ThemeContext";

export type { InputProps } from "pixel-retroui";

export function Input(props: InputProps) {
  const { theme } = useTheme();
  
  return (
    <PixelInput
      {...props}
      className={clsx("m-0", props.className)}
      textColor={theme === 'dark' ? colors.green[400] : colors.black}
      bg={theme === 'dark' ? colors.gray[800] : colors.white}
      shadowColor={theme === 'dark' ? colors.purple[600] : colors.amber[600]}
    />
  );
}
