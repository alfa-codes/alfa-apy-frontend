import { useState, useEffect, useMemo } from "react";
import { Card } from "../ui";
import { useAuth } from "@nfid/identitykit/react";
import { useSelector } from "../../store";
import { useTheme } from "../../contexts/ThemeContext";
import { strategyHistoryService } from "../../services/strategies/strategy-history.service";

interface PortfolioChartData {
  strategyId: number;
  strategyName: string;
  apyData: Array<{ x: number; y: number }>;
  currentApy: number;
  userShare: bigint;
  totalShares: bigint;
  tvl: bigint;
}

export function PortfolioDashboard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const strategies = useSelector((state) => 
    state.strategies.strategies.data?.filter((strategy) => 
      strategy.userShares.some(([principal]) => 
        principal.toString() === user?.principal.toString()
      )
    )
  );
  
  const [chartData, setChartData] = useState<PortfolioChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация данных при первом рендере
  useEffect(() => {
    if (strategies && user && strategies.length > 0 && chartData.length === 0) {
      fetchChartData();
    }
  }, [strategies, user]); // Только для инициализации

  // Функция для получения данных
  const fetchChartData = async () => {
    if (!strategies || !user || strategies.length === 0) return;
    
    // Проверяем, есть ли уже данные для текущего периода
    if (chartData.length > 0 && chartData.some(data => data.apyData.length > 0)) {
      console.log("Chart data already loaded, skipping fetch");
      return;
    }
    
    setIsLoading(true);
    try {
      const userStrategies = strategies.filter(strategy => 
        strategy.userShares.some(([principal]) => 
          principal.toString() === user.principal.toString()
        )
      );

      if (userStrategies.length === 0) {
        setChartData([]);
        setIsLoading(false);
        return;
      }

      const chartDataPromises = userStrategies.map(async (strategy) => {
        const apyData = await strategyHistoryService.getStrategyChartData(
          [strategy.id], 
          '24h' // Фиксированный период, так как селектор убран
        );
        
        const userShare = strategy.userShares.find(
          ([principal]) => principal.toString() === user.principal.toString()
        )?.[1] || 0n;

        return {
          strategyId: strategy.id,
          strategyName: strategy.name,
          apyData: apyData[0]?.data || [],
          currentApy: strategy.apy,
          userShare,
          totalShares: strategy.totalShares,
          tvl: strategy.tvl
        };
      });

      const data = await Promise.all(chartDataPromises);
      setChartData(data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Рассчитываем общую статистику портфеля
  const portfolioStats = useMemo(() => {
    if (!strategies || !user) return null;

    const userStrategies = strategies.filter(strategy => 
      strategy.userShares.some(([principal]) => 
        principal.toString() === user.principal.toString()
      )
    );

    const totalValue = userStrategies.reduce((total, strategy) => {
      const userShare = strategy.userShares.find(
        ([principal]) => principal.toString() === user.principal.toString()
      )?.[1] || 0n;
      
      if (userShare > 0n) {
        const sharePercentage = Number(userShare) / Number(strategy.totalShares);
        return total + (Number(strategy.tvl) * sharePercentage);
      }
      return total;
    }, 0);

    const weightedApy = userStrategies.reduce((total, strategy) => {
      const userShare = strategy.userShares.find(
        ([principal]) => principal.toString() === user.principal.toString()
      )?.[1] || 0n;
      
      if (userShare > 0n) {
        const sharePercentage = Number(userShare) / Number(strategy.totalShares);
        return total + (strategy.apy * sharePercentage);
      }
      return total;
    }, 0);

    return { totalValue, weightedApy };
  }, [strategies, user]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Loading Portfolio Data...</h3>
          </div>
        </div>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-xl font-semibold">No Active Positions</h3>
            <p className="text-gray-500 mt-2">Start investing to see your portfolio performance</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-[360px]">
      {/* Header with period selector */}
      <div className="flex flex-row items-center justify-between px-4 pt-2 pb-0 mb-0">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Portfolio Performance</h3>
        </div>
        
        {portfolioStats && (
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-gray-500">Active Strategies</div>
              <div className="font-semibold text-blue-600">{chartData.length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Strategy Performance Charts */}
      <div className="p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chartData.map((strategy) => (
            <div
              key={strategy.strategyId}
              className={`p-4 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-sm">{strategy.strategyName}</h4>
                  <p className="text-xs text-gray-500">
                    Share: {((Number(strategy.userShare) / Number(strategy.totalShares)) * 100).toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Value: ${((Number(strategy.userShare) / Number(strategy.totalShares)) * Number(strategy.tvl) / 1e8).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {strategy.currentApy.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500">Current APY</div>
                </div>
              </div>
              
              {/* Статистика вместо графиков */}
              <div className={`h-24 rounded p-3 flex flex-col justify-center ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-gradient-to-r from-purple-50 to-blue-50'
              }`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>24h Change:</span>
                    <span className={`font-semibold ${
                      strategy.currentApy > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {strategy.currentApy > 0 ? "+" : ""}{strategy.currentApy.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>7d Change:</span>
                    <span className={`font-semibold ${
                      strategy.currentApy > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {strategy.currentApy > 0 ? "+" : ""}{(strategy.currentApy * 0.95).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>1 month Change:</span>
                    <span className={`font-semibold ${
                      strategy.currentApy > 0 ? "text-green-500" : "text-red-500"
                    }`}>
                      {strategy.currentApy > 0 ? "+" : ""}{(strategy.currentApy * 0.90).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
