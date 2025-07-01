import { ConnectWallet } from "./connect-wallet";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@nfid/identitykit/react";
import { Button } from "./ui";

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="flex py-[20px] md:py-[30px] justify-between items-center">
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
          className="flex items-center"
        >
          <span className="mr-2">🔄</span>Swap
        </Button>
        {user && (
          <Button
            onClick={() => navigate("/profile")}
            className="flex items-center"
          >
            <span className="mr-2">👤</span>Profile
          </Button>
        )}
        <ConnectWallet />
      </div>
    </div>
  );
}
