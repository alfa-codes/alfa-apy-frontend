import colors from "tailwindcss/colors";
import { Strategies as StrategiesList } from "../strategies";
import { Card } from "../ui";

export function Strategies() {
  return (
    <div className="w-full max-w-[800px] mx-auto">
      <Card
        bg={colors.red[200]}
        shadowColor={colors.red[400]}
        className="mb-[30px]"
      >
        🚨 Warning: <b>KongSwap</b> has updated their canisters without backward
        compatibility during the hackathon. As a result, this website may not
        function correctly.
      </Card>
      <StrategiesList />
    </div>
  );
}
