import { Card } from "../ui";
import { useAuth } from "@nfid/identitykit/react";
import { useMemo } from "react";
import {
  useSelector,
  Status,
} from "../../store";
import { Strategy } from "../../services/strategies/strategy-service";

interface UserStatsData {
  totalTvl: bigint;
  totalStrategies: number;
  deposited: number;
}

export function UserStats() {
  const { user } = useAuth();
  const strategies = useSelector((state) => state.strategies.strategies.data?.filter((strategy) => strategy.userShares.some(([principal]) => principal.toString() === user?.principal.toString())));
  const balances = useSelector((state) => state.strategies.balances);
  const status = useSelector((state) => state.strategies.strategies.status);

  console.log("Initial data:", { user, strategies, balances, status });

  const userStats = useMemo(() => {
    console.log("useMemo called", { strategies, balances, status });

    if (!strategies || !balances || status !== Status.SUCCEEDED) {
      return {
        totalTvl: 0n,
        totalStrategies: 0,
        deposited: 0,
      };
    }

    const stats = strategies.reduce(
      (acc: UserStatsData, strategy: Strategy) => {
        console.log("Processing strategy:", strategy);
        console.log("Current acc state:", acc);

        const currentPool = strategy.currentPool;
        if (currentPool) {
          console.log("Current pool found:", currentPool);
          return {
            ...acc,
            totalTvl: acc.totalTvl + strategy.tvl,
            totalStrategies: acc.totalStrategies + 1,
            deposited: strategy.initialDeposit.reduce(
              (acc, [, value]) =>
                acc + Number(value) / (10 ** strategy.pools[0].token0.decimals) * (strategy.pools[0].price0 ?? 0),
              0
            )
          };
        }
        return acc;
      },
      {
        totalTvl: 0n,
        totalStrategies: 0,
        deposited: 0,
      }
    );

    return stats;
  }, [strategies, balances, status]);

  return (
    <Card className="p-[20px]">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h3 className="text-gray-600 text-sm">DEPOSITED</h3>
          <p className="text-2xl font-bold">
            ${(userStats.deposited).toFixed(2)}
          </p>
        </div>
        <div className="text-center flex-1">
          <h3 className="text-gray-600 text-sm">STRATEGIES</h3>
          <p className="text-2xl font-bold">
            {userStats.totalStrategies}
          </p>
        </div>
      </div>
    </Card>
  );
}
