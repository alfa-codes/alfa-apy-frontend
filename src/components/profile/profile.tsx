import { useState } from "react";
import { Button, Card } from "../ui";
import { UserStats } from "./user-stats";
import { EventRecordsCard } from "../event-records/card";
import { useTheme } from "../../contexts/ThemeContext";

export function Profile() {
  const { theme } = useTheme();
  // Dropdown for chart label
  const [chartType, setChartType] = useState<"APR Change" | "TVL Change">(
    "APR Change"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [period, setPeriod] = useState<"24h" | "1m" | "1y" | "all">("24h");


  // Mock data generator for chart
 

  return (
    <div className="grid grid-cols-1 gap-8 min-w-[800px]">
      <UserStats />
      <div className="grid grid-cols-1 gap-8">
        {/* TVL Chart */}
        <Card className="overflow-hidden">
          <div className="flex flex-row items-center justify-between px-4 pt-2 pb-0 mb-0">
            <div className="relative inline-block">
              <select
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value as "APR Change" | "TVL Change")
                }
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className="bg-transparent outline-none text-lg font-mono appearance-none pr-6"
                style={{ boxShadow: "none", border: "none" }}
              >
                <option value="APR Change">APR Change</option>
                <option value="TVL Change">TVL Change</option>
              </select>
              <span className="pointer-events-none absolute right-1 top-1/2 transform -translate-y-1/2 text-lg select-none">
                {dropdownOpen ? "▲" : "▼"}
              </span>
            </div>
            <div className="flex gap-4">
              {(["24h", "1m", "1y", "all"] as const).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="!h-[24px] !min-w-[40px] !px-2 text-xs"
                  bg={
                    theme === 'dark'
                      ? (period === p ? '#a78bfa' : '#232136')
                      : (period === p ? '#fbbf24' : '#fef3c7')
                  }
                  textColor={theme === 'dark' ? '#22ff88' : undefined}
                  shadowColor={theme === 'dark' ? '#a78bfa' : undefined}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-xl font-semibold">Coming soon</h3>
            </div>
          </div>
        </Card>
      </div>
      <EventRecordsCard />
    </div>
  );
}
