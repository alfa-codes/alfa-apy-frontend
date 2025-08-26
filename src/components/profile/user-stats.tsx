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
  currentApy: number;
  deposited: number;
  totalYield: number;
  portfolioValue: number;
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
        currentApy: 0,
        deposited: 0,
        totalYield: 0,
        portfolioValue: 0,
      };
    }

    const stats = strategies.reduce(
      (acc: UserStatsData, strategy: Strategy) => {
        console.log("Processing strategy:", strategy);
        console.log("Current acc state:", acc);

        const currentPool = strategy.currentPool;
        if (currentPool) {
          console.log("Current pool found:", currentPool);
          
          // Получаем долю пользователя в этой стратегии
          const userShare = strategy.userShares.find(
            ([principal]) => principal.toString() === user?.principal.toString()
          )?.[1] || 0n;
          
          // Рассчитываем вес стратегии в портфеле пользователя
          const strategyWeight = userShare > 0n ? Number(userShare) / Number(strategy.totalShares) : 0;
          
          // Рассчитываем текущую стоимость позиции пользователя (используем getUserInitialDeposit)
          const currentPositionValue = strategy.getUserInitialDeposit(user?.principal!);
          
          // Рассчитываем начальную стоимость позиции из initialDeposit
          const initialDeposit = strategy.initialDeposit.find(([principal]) => 
            principal.toString() === user?.principal.toString()
          )?.[1] || 0n;
          
          // Проверяем валидность данных перед расчетом
          if (initialDeposit === 0n || currentPositionValue === 0) {
            console.log(`Strategy ${strategy.name}: Skipping yield calculation - no initial deposit or current position`);
            return {
              ...acc,
              totalTvl: acc.totalTvl + strategy.tvl,
              currentApy: acc.currentApy + (strategy.apy * strategyWeight),
              deposited: strategy.initialDeposit.reduce(
                (acc, [, value]) =>
                  acc + Number(value) / (10 ** strategy.pools[0].token0.decimals) * (strategy.pools[0].price0 ?? 0),
                0
              ),
              totalYield: acc.totalYield, // Не изменяем yield
              portfolioValue: acc.portfolioValue + (Number(strategy.tvl) * strategyWeight)
            };
          }
          
          const initialPositionValue = Number(initialDeposit) / (10 ** strategy.pools[0].token0.decimals) * 
            (strategy.pools[0].price0 ?? 0);
          
          // TOTAL YIELD = Текущая стоимость - Начальная стоимость
          const strategyYield = currentPositionValue - initialPositionValue;
          
          console.log(`Strategy ${strategy.name} yield calculation:`, {
            strategyName: strategy.name,
            userShare: userShare.toString(),
            totalShares: strategy.totalShares.toString(),
            strategyTvl: strategy.tvl.toString(),
            currentPositionValue: currentPositionValue.toFixed(6),
            initialDeposit: initialDeposit.toString(),
            tokenDecimals: strategy.pools[0].token0.decimals,
            tokenPrice: strategy.pools[0].price0,
            initialPositionValue: initialPositionValue.toFixed(6),
            strategyYield: strategyYield.toFixed(6),
            // Добавляем дополнительную информацию для отладки
            userPrincipal: user?.principal.toString(),
            hasInitialDeposit: initialDeposit > 0n,
            hasUserShare: userShare > 0n,
            strategyWeight: strategyWeight.toFixed(4)
          });
          
          return {
            ...acc,
            totalTvl: acc.totalTvl + strategy.tvl,
            currentApy: acc.currentApy + (strategy.apy * strategyWeight),
            deposited: strategy.initialDeposit.reduce(
              (acc, [, value]) =>
                acc + Number(value) / (10 ** strategy.pools[0].token0.decimals) * (strategy.pools[0].price0 ?? 0),
              0
            ),
            totalYield: acc.totalYield + strategyYield,
            portfolioValue: acc.portfolioValue + (Number(strategy.tvl) * strategyWeight)
          };
        }
        return acc;
      },
      {
        totalTvl: 0n,
        currentApy: 0,
        deposited: 0,
        totalYield: 0,
        portfolioValue: 0,
      }
    );

    console.log("Final userStats calculation:", {
      totalTvl: stats.totalTvl.toString(),
      currentApy: stats.currentApy.toFixed(4),
      deposited: stats.deposited.toFixed(4),
      totalYield: stats.totalYield.toFixed(6),
      portfolioValue: (stats.portfolioValue / 1e8).toFixed(2)
    });

    return stats;
  }, [strategies, balances, status, user?.principal]);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Portfolio Value */}
        <div className="text-center">
          <h3 className="text-gray-600 text-sm font-medium mb-2">PORTFOLIO VALUE</h3>
          <p className="text-xl lg:text-2xl font-bold text-purple-600 mb-1">
            ${(userStats.portfolioValue / 1e8).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Total portfolio worth</p>
        </div>
        
        {/* DEPOSITED */}
        <div className="text-center">
          <h3 className="text-gray-600 text-sm font-medium mb-2">DEPOSITED</h3>
          <p className="text-xl lg:text-2xl font-bold text-blue-600">
            ${userStats.deposited.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Total invested</p>
        </div>
        
        {/* CURRENT APY */}
        <div className="text-center">
          <h3 className="text-gray-600 text-sm font-medium mb-2">CURRENT APY</h3>
          <p className="text-xl lg:text-2xl font-bold text-green-600">
            {userStats.currentApy.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500">Weighted average</p>
        </div>
        
        {/* TOTAL YIELD */}
        <div className="text-center">
          <h3 className="text-gray-600 text-sm font-medium mb-2">TOTAL YIELD</h3>
          <p className="text-xl lg:text-2xl font-bold text-emerald-600">
            ${userStats.totalYield.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Profit earned</p>
        </div>
      </div>
    </Card>
  );
}
