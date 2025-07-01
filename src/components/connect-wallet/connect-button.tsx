import { ConnectWalletButtonProps } from "@nfid/identitykit/react";
import { Button } from "../ui";
import { useTheme } from "../../contexts/ThemeContext";

export function ConnectButton(props: ConnectWalletButtonProps) {
  const { theme } = useTheme();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <Button 
      {...props as any}
      className={theme === 'dark' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
    >
      Connect wallet
    </Button>
  );
}
