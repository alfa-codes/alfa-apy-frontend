import {
  _SERVICE,
  Pool,
  PoolByTokens,
  PoolMetrics,
} from "../../idl/pool_stats";
import { idlFactory } from "../../idl/pool_stats_idl";
import { getAnonActor } from "../utils";
import { POOL_STATS_CANISTER_ID } from "../../constants";
export class PoolStatsService {
  public async get_pools(): Promise<Array<Pool>> {
    const anonymousActor = await getAnonActor<_SERVICE>(
      POOL_STATS_CANISTER_ID,
      idlFactory
    );
    return await anonymousActor.get_pools();
  }

  public async get_all_pool_metrics(): Promise<Array<[PoolByTokens, PoolMetrics]>> {
    const pools = await this.get_pools();
    const poolMetrics = await this.get_pool_metrics(pools.map((p) => ({
      provider: p.provider,
      token0: p.token0,
      token1: p.token1,
    })));
    return poolMetrics;
  }

  public async get_pool_metrics(
    metricsRequest: Array<PoolByTokens>
  ): Promise<Array<[PoolByTokens, PoolMetrics]>> {
    const anonymousActor = await getAnonActor<_SERVICE>(
      POOL_STATS_CANISTER_ID,
      idlFactory
    );
    return await anonymousActor.get_pool_metrics(metricsRequest);
  }
}

export const poolStatsService = new PoolStatsService();
