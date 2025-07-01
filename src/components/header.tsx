import { ConnectWallet } from "./connect-wallet";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@nfid/identitykit/react";
import { Button, ThemeToggle } from "./ui";
import { useTheme } from "../contexts/ThemeContext";

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  return (
    <div className={`flex py-[20px] md:py-[30px] justify-between items-center ${
      theme === 'dark' ? 'text-green-400' : 'text-gray-900'
    }`}>
      <img
        onClick={() => {
          navigate("/");
        }}
        src={logo}
        alt="logo"
        className="w-[100px] cursor-pointer"
      />
      <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/swap")}
          className={`flex items-center ${
            theme === 'dark' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : ''
          }`}
        >
          <span className="mr-2">🔄</span>Swap
        </Button>
        {user && (
          <Button
            onClick={() => navigate("/profile")}
            className={`flex items-center ${
              theme === 'dark' 
                ? 'bg-purple-600 hover:bg-purple-700 text-green-400' 
                : ''
            }`}
          >
            <span className="mr-2">👤</span>Profile
          </Button>
        )}
        <ConnectWallet />
        <ThemeToggle />
      </div>
    </div>
  );
}
