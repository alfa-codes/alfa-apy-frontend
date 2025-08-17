import { _SERVICE } from "../../idl/sstrategy_history";
import { idlFactory } from "../../idl/strategy_history_idl";
import { getAnonActor } from "../utils";
import { STRATEGY_HISTORY_CANISTER_ID } from "../../constants";

export interface ChartDataPoint {
  x: number; // timestamp
  y: number; // total balance value
}

export interface StrategyChartData {
  strategyId: number;
  data: ChartDataPoint[];
}

export interface ChartPeriod {
  "24h": { length: number; interval: number };
  "1w": { length: number; interval: number };
  "1m": { length: number; interval: number };
}

export class StrategyHistoryService {
  /**
   * Получает историю стратегий для построения графика
   * @param strategyIds - массив ID стратегий
   * @param period - период для графика
   * @returns данные для построения графика
   */
  public async getStrategyChartData(
    strategyIds: number[],
    period: keyof ChartPeriod
  ): Promise<StrategyChartData[]> {
    try {
      const anonymousActor = await getAnonActor<_SERVICE>(
        STRATEGY_HISTORY_CANISTER_ID,
        idlFactory
      );

      // Всегда запрашиваем данные за месяц
      const now = BigInt(Date.now());
      const monthAgo = now - BigInt(30 * 24 * 60 * 60 * 1000); // 30 дней назад
      const fromTimestamp = monthAgo;
      const toTimestamp = now;

      const request: {
        from_timestamp: [] | [bigint];
        to_timestamp: [] | [bigint];
        strategy_ids: [] | [Uint16Array | number[]];
      } = {
        from_timestamp: fromTimestamp ? [fromTimestamp] : [],
        to_timestamp: toTimestamp ? [toTimestamp] : [],
        strategy_ids: [strategyIds as Uint16Array | number[]],
      };

      const result = await anonymousActor.get_strategies_history(request);

      if ("Ok" in result) {
        const processedData = result.Ok.map((strategyHistory) => ({
          strategyId: strategyHistory.strategy_id,
          data: this.processSnapshots(strategyHistory.snapshots, period),
        }));
        return processedData;
      } else {
        console.error("Error fetching strategy history:", result.Err);
        throw new Error(`Failed to fetch strategy history: ${result.Err.message}`);
      }
    } catch (error) {
      console.error("Error in getStrategyChartData:", error);
      throw error;
    }
  }

  /**
   * Обрабатывает снэпшоты для создания данных графика
   * @param snapshots - массив снэпшотов стратегии
   * @param period - период графика
   * @returns массив точек данных для графика
   */
  private processSnapshots(
    snapshots: unknown[],
    period: keyof ChartPeriod
  ): ChartDataPoint[] {
    if (!snapshots || snapshots.length === 0) {
      console.log("No snapshots to process");
      return [];
    }

    console.log("Processing snapshots:", snapshots);

    // Сортируем снэпшоты по времени
    const sortedSnapshots = snapshots.sort((a, b) => {
      const aTimestamp = (a as { timestamp: bigint })?.timestamp;
      const bTimestamp = (b as { timestamp: bigint })?.timestamp;
      return Number(aTimestamp || 0) - Number(bTimestamp || 0);
    });

    // Преобразуем в формат для графика - используем реальное поле APY
    // Генерируем данные в зависимости от периода
    const chartData: ChartDataPoint[] = [];
    
    if (period === "24h") {
      // 24 часа - 24 точки
      for (let hour = 0; hour < 24; hour++) {
        const snapshot = sortedSnapshots.find(s => {
          const typedS = s as { timestamp: bigint };
          const snapshotHour = new Date(Number(typedS.timestamp)).getHours();
          return snapshotHour === hour;
        });
        
        if (snapshot) {
          const typedSnapshot = snapshot as { apy: number };
          chartData.push({ x: hour, y: typedSnapshot.apy });
        } else {
          const lastValue = chartData.length > 0 ? chartData[chartData.length - 1].y : 0;
          chartData.push({ x: hour, y: lastValue });
        }
      }
    } else if (period === "1w") {
      // 1 неделя - каждую 24-ю точку (7 точек)
      for (let day = 0; day < 7; day++) {
        const index = day * 24;
        if (index < sortedSnapshots.length) {
          const snapshot = sortedSnapshots[index];
          const typedSnapshot = snapshot as { apy: number };
          chartData.push({ x: day, y: typedSnapshot.apy });
        }
      }
    } else if (period === "1m") {
      // 1 месяц - каждую 24-ю точку (30 точек)
      for (let day = 0; day < 30; day++) {
        const index = day * 24;
        if (index < sortedSnapshots.length) {
          const snapshot = sortedSnapshots[index];
          const typedSnapshot = snapshot as { apy: number };
          chartData.push({ x: day, y: typedSnapshot.apy });
        }
      }
    }

    console.log("Processed chart data:", chartData);
    return chartData;
  }

  /**
   * Получает количество снэпшотов для стратегии
   * @param strategyId - ID стратегии
   * @returns количество снэпшотов
   */
  public async getSnapshotsCount(strategyId: number): Promise<bigint> {
    try {
      const anonymousActor = await getAnonActor<_SERVICE>(
        STRATEGY_HISTORY_CANISTER_ID,
        idlFactory
      );

      return await anonymousActor.get_strategy_snapshots_count(strategyId);
    } catch (error) {
      console.error("Error in getSnapshotsCount:", error);
      return BigInt(0);
    }
  }
}

// Экспортируем экземпляр сервиса
export const strategyHistoryService = new StrategyHistoryService();
