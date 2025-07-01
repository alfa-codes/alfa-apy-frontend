import clsx from "clsx";
import { Card as PixelCard, CardProps } from "pixel-retroui";
import colors from "tailwindcss/colors";
import { useTheme } from "../../contexts/ThemeContext";

export function Card({
  children,
  className,
  light,
  ...props
}: CardProps & { light?: boolean }) {
  const { theme } = useTheme();

  const cardBg = theme === 'dark' 
    ? (light ? colors.gray[800] : colors.gray[900])
    : (light ? colors.amber[100] : colors.amber[200]);
  
  const cardShadow = theme === 'dark' 
    ? colors.purple[600] 
    : colors.amber[600];
  
  const cardText = theme === 'dark' 
    ? colors.green[400] 
    : colors.black;

  return (
    <PixelCard
      className={clsx("m-0", className)}
      bg={cardBg}
      shadowColor={cardShadow}
      textColor={cardText}
      {...props}
    >
      {children}
    </PixelCard>
  );
}
