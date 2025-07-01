import { Profile as ProfileCard } from "../profile/profile";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <>
      <div>
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
      <div className="flex flex-col items-center">
        <ProfileCard />
      </div>
    </>
  );
}
