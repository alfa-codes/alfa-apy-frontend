import {
  _SERVICE,
  Pool,
  PoolByTokens,
  PoolMetrics,
} from "../../idl/pool_stats";
import { idlFactory } from "../../idl/pool_stats_idl";
import { getAnonActor } from "../utils";

export const poolsDataCanister = "oxawg-7aaaa-aaaag-aub6q-cai";

export class PoolStatsService {
  public async get_pools(): Promise<Array<Pool>> {
    const anonymousActor = await getAnonActor<_SERVICE>(
      poolsDataCanister,
      idlFactory
    );
    return await anonymousActor.get_pools();
  }

  public async get_pool_metrics(
    metricsRequest: Array<PoolByTokens>
  ): Promise<Array<[PoolByTokens, PoolMetrics]>> {
    const anonymousActor = await getAnonActor<_SERVICE>(
      poolsDataCanister,
      idlFactory
    );
    return await anonymousActor.get_pool_metrics(metricsRequest);
  }
}

export const poolStatsService = new PoolStatsService();
