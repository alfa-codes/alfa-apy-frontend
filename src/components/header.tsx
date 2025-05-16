import { ConnectWallet } from "./connect-wallet";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
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
      <div>
        <ConnectWallet />
      </div>
    </div>
  );
}
