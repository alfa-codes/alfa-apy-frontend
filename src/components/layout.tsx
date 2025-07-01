import { PropsWithChildren } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export function Layout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  return (
    // <PageLoader>
      <div className={`container w-full max-w-[1341px] px-[10px] md:px-[20px] lg:px-[30px] mx-auto min-h-[100vh] flex flex-col ${
        theme === 'dark' ? 'text-green-400' : 'text-gray-900'
      }`}>
        <Header />
        <h1 className={`text-center text-[36px] ${
          theme === 'dark' ? 'text-green-400' : 'text-gray-900'
        }`}>
          Dominate DeFi with highest APY
        </h1>
        {location.pathname === "/swap" && (
          <div className="w-full mb-[20px]">
            <button
              onClick={() => navigate("/")}
              className={`transition-colors text-[20px] ml-[20px] ${
                theme === 'dark' 
                  ? 'text-green-300 hover:text-green-400' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ← Back
            </button>
          </div>
        )}
        <div className="my-auto pb-[50px]">{children}</div>
        <Footer className="mt-auto" />
      </div>
    // {/* </PageLoader> */}
  );
}
