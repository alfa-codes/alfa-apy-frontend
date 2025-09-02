import {
  _SERVICE,
  Pool,
  PoolMetrics,
  GetPoolsHistoryRequest,
  PoolHistory,
} from "../../idl/pool_stats";
import { idlFactory } from "../../idl/pool_stats_idl";
import { getAnonActor, hasOwnProperty } from "../utils";
import { POOL_STATS_CANISTER_ID } from "../../constants";
import { storageWithTtl } from "../token/icrc1/service/storage";
export class PoolStatsService {
  public async get_pools(): Promise<Array<Pool>> {
    const cacheKey = 'get_pools';
    const cache = await storageWithTtl.getEvenExpired(cacheKey);
    
    if (!cache) {
      const anonymousActor = await getAnonActor<_SERVICE>(
        POOL_STATS_CANISTER_ID,
        idlFactory
      );
      const result = await anonymousActor.get_pools();
      if (hasOwnProperty(result, "Err")) {
        throw new Error((result.Err as { message: string }).message);
      }
      
      storageWithTtl.set(
        cacheKey,
        JSON.stringify(result.Ok, (_, value) => 
          typeof value === 'bigint' ? value.toString() : value
        ),
        60 * 1000, // 1 минута TTL
      );
      return result.Ok;
    } else if (cache && cache.expired) {
      // Асинхронно обновляем кеш
      this.get_pools_fresh().then((response) => {
        storageWithTtl.set(
          cacheKey,
          JSON.stringify(response, (_, value) => 
            typeof value === 'bigint' ? value.toString() : value
          ),
          60 * 1000,
        );
      });
      return JSON.parse(cache.value as string);
    } else {
      return JSON.parse(cache.value as string);
    }
  }

  private async get_pools_fresh(): Promise<Array<Pool>> {
    const anonymousActor = await getAnonActor<_SERVICE>(
      POOL_STATS_CANISTER_ID,
      idlFactory
    );
    const result = await anonymousActor.get_pools();
    if (hasOwnProperty(result, "Err")) {
      throw new Error((result.Err as { message: string }).message);
    }
    return result.Ok;
  }

  public async get_all_pool_metrics(): Promise<Array<[string, PoolMetrics]>> {
    const pools = await this.get_pools();

    const poolMetrics = await this.get_pool_metrics(pools.map((p) => p.id));
    return poolMetrics;
  }


  //TODO: add_type_pool_id
  public async get_pool_metrics(
    metricsRequest: Array<string>
  ): Promise<Array<[string, PoolMetrics]>> {
    const cacheKey = `get_pool_metrics_${metricsRequest.sort().join(',')}`;
    const cache = await storageWithTtl.getEvenExpired(cacheKey);
    
    if (!cache) {
      const anonymousActor = await getAnonActor<_SERVICE>(
        POOL_STATS_CANISTER_ID,
        idlFactory
      );
      const result = await anonymousActor.get_pool_metrics(metricsRequest);
      if (hasOwnProperty(result, "Err")) {
        throw new Error((result.Err as { message: string }).message);
      }
      storageWithTtl.set(
        cacheKey,
        JSON.stringify(result, (_, value) => 
          typeof value === 'bigint' ? value.toString() : value
        ),
        60 * 1000, // 1 минута TTL
      );
      return result.Ok;
    } else if (cache && cache.expired) {
      // Асинхронно обновляем кеш
      this.get_pool_metrics_fresh(metricsRequest).then((response) => {
        storageWithTtl.set(
          cacheKey,
          JSON.stringify(response, (_, value) => 
            typeof value === 'bigint' ? value.toString() : value
          ),
          60 * 1000,
        );
      });
      return JSON.parse(cache.value as string);
    } else {
      return JSON.parse(cache.value as string);
    }
  }

  private async get_pool_metrics_fresh(
    metricsRequest: Array<string>
  ): Promise<Array<[string, PoolMetrics]>> {
    const anonymousActor = await getAnonActor<_SERVICE>(
      POOL_STATS_CANISTER_ID,
      idlFactory
    );
    const result = await anonymousActor.get_pool_metrics(metricsRequest);
    if (hasOwnProperty(result, "Err")) {
      throw new Error((result.Err as { message: string }).message);
    }
    return result.Ok;
  }

  public async get_pools_history(request: GetPoolsHistoryRequest): Promise<Array<PoolHistory>> {
    const anonymousActor = await getAnonActor<_SERVICE>(
      POOL_STATS_CANISTER_ID,
      idlFactory
    );
    const result = await anonymousActor.get_pools_history(request);
    if (hasOwnProperty(result, "Err")) {
      throw new Error((result.Err as { message: string }).message);
    }
    return result.Ok;
  }
}

export const poolStatsService = new PoolStatsService();
