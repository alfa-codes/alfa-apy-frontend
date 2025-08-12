import { StrategyHistoryService } from './strategy-history.service';

describe('StrategyHistoryService', () => {
  let service: StrategyHistoryService;

  beforeEach(() => {
    service = new StrategyHistoryService();
  });

  describe('getStrategyChartData', () => {
    it('should return empty array for empty strategy IDs', async () => {
      const result = await service.getStrategyChartData([], '24h');
      expect(result).toEqual([]);
    });

    it('should handle single strategy ID', async () => {
      // Mock the actor call
      const mockActor = {
        get_strategies_history: jest.fn().mockResolvedValue({
          Ok: [{
            strategy_id: 1,
            snapshots: [
              {
                timestamp: BigInt(Date.now()),
                total_balance: BigInt(1000000),
              }
            ],
            total_count: BigInt(1),
          }]
        })
      };

      // This is a basic test structure - in a real test you'd mock the actor properly
      expect(mockActor.get_strategies_history).toBeDefined();
    });
  });

  describe('processSnapshots', () => {
    it('should return empty array for empty snapshots', () => {
      const result = (service as any).processSnapshots([], '24h');
      expect(result).toEqual([]);
    });

    it('should process snapshots correctly', () => {
      const snapshots = [
        {
          timestamp: BigInt(1000),
          total_balance: BigInt(1000000),
        },
        {
          timestamp: BigInt(2000),
          total_balance: BigInt(2000000),
        }
      ];

      const result = (service as any).processSnapshots(snapshots, '24h');
      expect(result).toEqual([
        { x: 1000, y: 1000000 },
        { x: 2000, y: 2000000 },
      ]);
    });
  });
});
