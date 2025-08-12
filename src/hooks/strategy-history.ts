import { useState, useEffect, useCallback, useMemo } from 'react';
import { strategyHistoryService, ChartDataPoint } from '../services/strategies/strategy-history.service';

export interface UseStrategyHistoryParams {
  strategyIds: number[];
  period: "24h" | "1m" | "all";
  autoFetch?: boolean;
}

export interface UseStrategyHistoryReturn {
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useStrategyHistory({
  strategyIds,
  period,
  autoFetch = true,
}: UseStrategyHistoryParams): UseStrategyHistoryReturn {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
    if (strategyIds.length === 0) {
      setChartData([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const strategyChartData = await strategyHistoryService.getStrategyChartData(
        strategyIds,
        period
      );
      
      if (strategyChartData.length > 0) {
        // Объединяем данные всех стратегий в один массив
        const allData = strategyChartData.flatMap(strategy => strategy.data);
        setChartData(allData);
      } else {
        setChartData([]);
      }
    } catch (err) {
      console.error("Error fetching strategy history:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load chart data";
      setError(errorMessage);
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  }, [strategyIds, period]);

  // Стабилизируем данные, чтобы предотвратить лишние ререндеры
  const stableChartData = useMemo(() => chartData, [chartData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    chartData: stableChartData,
    isLoading,
    error,
    fetchData,
    refetch,
  };
}
