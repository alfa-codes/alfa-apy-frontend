import { useMemo } from "react";
import { Card } from "../ui";
import { Button } from "../ui";
import { useAuth } from "@nfid/identitykit/react";
import { useSelector, Status } from "../../store";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const strategies = useSelector((state) => 
    state.strategies.strategies.data?.filter((strategy) => 
      strategy.userShares.some(([principal]) => 
        principal.toString() === user?.principal.toString()
      )
    )
  );
  const status = useSelector((state) => state.strategies.strategies.status);

  // Анализируем портфель для рекомендаций
  const portfolioAnalysis = useMemo(() => {
    if (!strategies || !user || status !== Status.SUCCEEDED) return null;

    const userStrategies = strategies.filter(strategy => 
      strategy.userShares.some(([principal]) => 
        principal.toString() === user.principal.toString()
      )
    );

    if (userStrategies.length === 0) return null;

    // Находим лучшую стратегию по APY
    const bestStrategy = userStrategies.reduce((best, current) => 
      current.apy > best.apy ? current : best
    );

    // Рассчитываем диверсификацию
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

    // Рассчитываем средний APY портфеля
    const averageApy = userStrategies.reduce((total, strategy) => {
      const userShare = strategy.userShares.find(
        ([principal]) => principal.toString() === user.principal.toString()
      )?.[1] || 0n;
      
      if (userShare > 0n) {
        const sharePercentage = Number(userShare) / Number(strategy.totalShares);
        return total + (strategy.apy * sharePercentage);
      }
      return total;
    }, 0);

    const diversificationScore = userStrategies.length >= 3 ? 'High' : 
                                userStrategies.length >= 2 ? 'Medium' : 'Low';

    return {
      bestStrategy,
      totalValue,
      diversificationScore,
      strategyCount: userStrategies.length,
      averageApy
    };
  }, [strategies, user, status]);

  if (!portfolioAnalysis) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Portfolio Insights</h3>
          <p className="text-gray-500 mb-4">Start investing to unlock portfolio insights</p>
          <Button
            onClick={() => navigate('/strategies')}
            className="w-full max-w-[200px]"
            bg={theme === 'dark' ? '#a78bfa' : '#3b82f6'}
            textColor={theme === 'dark' ? '#22ff88' : '#ffffff'}
          >
            Explore Strategies
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
      <h3 className="text-lg font-semibold mb-4">Portfolio Insights</h3>
      
      <div className="space-y-4">
        {/* Top Performing Strategy */}
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Top Performer</span>
            <span className="text-sm font-bold text-green-600">
              {portfolioAnalysis.bestStrategy.apy.toFixed(2)}% APY
            </span>
          </div>
          <div className="text-xs text-gray-500 mb-3">
            {portfolioAnalysis.bestStrategy.name}
          </div>
          <Button
            onClick={() => navigate(`/strategies/${portfolioAnalysis.bestStrategy.id}`)}
            className="w-full text-xs py-1"
            bg={theme === 'dark' ? '#22c55e' : '#10b981'}
            textColor="#ffffff"
          >
            View Strategy
          </Button>
        </div>

        {/* Risk Assessment */}
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-purple-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Risk Assessment</span>
            <span className={`text-xs px-2 py-1 rounded ${
              portfolioAnalysis.strategyCount >= 3 
                ? 'bg-green-100 text-green-800' 
                : portfolioAnalysis.strategyCount >= 2
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {portfolioAnalysis.strategyCount >= 3 ? 'Low' : portfolioAnalysis.strategyCount >= 2 ? 'Medium' : 'High'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Based on diversification and strategy count
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Diversification:</span>
              <span className={portfolioAnalysis.diversificationScore === 'High' ? 'text-green-600' : 'text-yellow-600'}>
                {portfolioAnalysis.diversificationScore}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Strategy Count:</span>
              <span>{portfolioAnalysis.strategyCount}</span>
            </div>
          </div>
        </div>

        {/* Liquidity Status */}
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-teal-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Liquidity Status</span>
            <span className="text-xs px-2 py-1 rounded bg-teal-100 text-teal-800">
              Active
            </span>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            All strategies are actively managed
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Active Strategies:</span>
              <span className="font-medium text-teal-600">
                {portfolioAnalysis.strategyCount}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Status:</span>
              <span className="text-green-600">All operational</span>
            </div>
          </div>
        </div>

        {/* Yield Analysis */}
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Yield Analysis</span>
            <span className="text-sm font-bold text-blue-600">
              {portfolioAnalysis.averageApy.toFixed(2)}% APY
            </span>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Portfolio weighted average yield
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>vs Market:</span>
              <span className={portfolioAnalysis.averageApy > 12 ? 'text-green-600' : 'text-yellow-600'}>
                {portfolioAnalysis.averageApy > 12 ? 'Above average' : 'Below average'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Best Strategy:</span>
              <span className="font-medium text-green-600">
                +{portfolioAnalysis.bestStrategy.apy.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}