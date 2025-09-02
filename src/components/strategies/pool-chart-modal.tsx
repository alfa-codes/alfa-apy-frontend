import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { LineChart } from '../charts/line-chart';
import { poolStatsService } from '../../services/strategies/pool-stats.service';
import { GetPoolsHistoryRequest, PoolHistory, PoolSnapshotResponse } from '../../idl/pool_stats';
import { useTheme } from '../../contexts/ThemeContext';

interface PoolChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  poolId: string | null;
  poolName?: string;
}

interface ChartDataPoint {
  x: number;
  y: number;
}

export function PoolChartModal({ isOpen, onClose, poolId, poolName }: PoolChartModalProps) {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState<"24h" | "1w" | "1m">("24h");

  useEffect(() => {
    if (isOpen && poolId) {
      loadPoolHistory();
    }
  }, [isOpen, poolId, period]);

  const loadPoolHistory = async () => {
    if (!poolId) return;

    try {
      setIsLoading(true);
      
      // Вычисляем временные рамки в зависимости от периода
      const now = BigInt(Math.floor(Date.now() / 1000));
      let fromTimestamp: bigint;
      
      switch (period) {
        case "24h":
          fromTimestamp = now - BigInt(24 * 60 * 60);
          break;
        case "1w":
          fromTimestamp = now - BigInt(7 * 24 * 60 * 60);
          break;
        case "1m":
          fromTimestamp = now - BigInt(30 * 24 * 60 * 60);
          break;
        default:
          fromTimestamp = now - BigInt(24 * 60 * 60);
      }

      const request: GetPoolsHistoryRequest = {
        from_timestamp: [fromTimestamp],
        to_timestamp: [now],
        pool_ids: [[poolId]],
      };

      const poolHistory: PoolHistory[] = await poolStatsService.get_pools_history(request);
      
      if (poolHistory.length > 0) {
        const poolData = poolHistory[0];
        const processedData = processSnapshots(poolData.snapshots, period);
        setChartData(processedData);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error('Error loading pool history:', error);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processSnapshots = (snapshots: PoolSnapshotResponse[], period: "24h" | "1w" | "1m"): ChartDataPoint[] => {
    if (!snapshots || snapshots.length === 0) {
      console.log("No snapshots to process");
      return [];
    }

    // Сортируем снэпшоты по времени
    const sortedSnapshots = snapshots.sort((a, b) => {
      const aTimestamp = a?.timestamp;
      const bTimestamp = b?.timestamp;
      return Number(aTimestamp || 0) - Number(bTimestamp || 0);
    });

    // Преобразуем в формат для графика - используем реальное поле APY
    // Генерируем данные в зависимости от периода
    const chartData: ChartDataPoint[] = [];
    
    if (period === "24h") {
      // 24 часа - снэпшоты от 0 до 23
      for (let i = 0; i < 24; i++) {
        if (i < sortedSnapshots.length) {
          const snapshot = sortedSnapshots[i];
          const apyValue = snapshot.apy.tokens_apy; // Используем tokens APY
          chartData.push({ x: i, y: apyValue });
        } else {
          // Если снэпшотов меньше 24, заполняем оставшиеся точки последним значением
          const lastValue = chartData.length > 0 ? chartData[chartData.length - 1].y : 0;
          chartData.push({ x: i, y: lastValue });
        }
      }
    } else if (period === "1w") {
      // 1 неделя - каждую 24-ю точку (7 точек)
      for (let day = 0; day < 7; day++) {
        const index = day * 24;
        if (index < sortedSnapshots.length) {
          const snapshot = sortedSnapshots[index];
          const apyValue = snapshot.apy.tokens_apy; // Используем tokens APY
          chartData.push({ x: day, y: apyValue });
        }
      }
    } else if (period === "1m") {
      // 1 месяц - каждую 24-ю точку (30 точек)
      for (let day = 0; day < 30; day++) {
        const index = day * 24;
        if (index < sortedSnapshots.length) {
          const snapshot = sortedSnapshots[index];
          const apyValue = snapshot.apy.tokens_apy; // Используем tokens APY
          chartData.push({ x: day, y: apyValue });
        }
      }
    }

    return chartData;
  };

  const chartSeries = [
    {
      name: `APY ${poolName || poolId}`,
      data: chartData,
      color: "#a855f7", // Purple color like APY Change chart
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div>
                <h2 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  APY Change
                </h2>
                {poolName && (
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {poolName}
                  </p>
                )}
              </div>
              
              {/* Period Selector */}
              <div className="flex gap-2">
                {(["24h", "1w", "1m"] as const).map((p) => (
                  <Button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className="!h-8 !min-w-[60px] !px-3 text-xs"
                    bg={period === p ? (theme === 'dark' ? '#a78bfa' : '#fbbf24') : (theme === 'dark' ? '#374151' : '#f3f4f6')}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={onClose}
                className="!h-8 !min-w-[80px] !px-3 text-xs"
                bg={theme === 'dark' ? '#374151' : '#f3f4f6'}
              >
                Close
              </Button>
            </div>

            {/* Chart Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className={`text-lg ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Loading chart data...
                  </div>
                </div>
              ) : chartData.length > 0 ? (
                <LineChart
                  series={chartSeries}
                  period={period}
                />
              ) : (
                <div className="flex items-center justify-center h-96">
                  <div className={`text-lg ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No data available for this pool
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
