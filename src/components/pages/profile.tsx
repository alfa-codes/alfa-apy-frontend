import { Profile as ProfileCard } from "../profile/profile";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center">
      <ProfileCard />
    </div>
  );
}
