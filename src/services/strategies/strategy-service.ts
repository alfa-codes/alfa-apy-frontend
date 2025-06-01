/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  _SERVICE as VaultType,
  StrategyResponse,
  UserStrategyResponse,
} from "../../idl/vault.ts";
import { idlFactory } from "../../idl/vault_idl.ts";
import { Principal } from "@dfinity/principal";
import { getAnonActor } from "../utils.ts";
import { poolStatsService } from "./pool-stats.service.ts";
import { tokensService } from "../tokens-service.ts";
import { getPoolId } from "../../utils/pools.ts";

export const alfaACanister = "ownab-uaaaa-aaaap-qp2na-cai";

export interface Strategy extends StrategyResponse {
  apy: number;
  tvl: number;
}

export class StrategiesService {
  public async get_strategies(): Promise<Array<StrategyResponse>> {
    const anonymousActor = await getAnonActor<VaultType>(
      alfaACanister,
      idlFactory
    );
    const strategies = await anonymousActor.get_strategies();
    const poolMetricsArgs = await Promise.all(
      strategies.flatMap((strategy) =>
        strategy.pools.map(async (pool) => {
          const token0Ledger = await tokensService.get_token_ledger(
            pool.token0
          );
          const token1Ledger = await tokensService.get_token_ledger(
            pool.token1
          );
          return {
            provider: pool.provider,
            token0: {
              ledger: Principal.fromText(token0Ledger ?? ""),
              symbol: pool.token0,
            },
            token1: {
              ledger: Principal.fromText(token1Ledger ?? ""),
              symbol: pool.token1,
            },
          };
        })
      )
    );
    const poolStats = await poolStatsService.get_pool_metrics(poolMetricsArgs);
    return strategies.map((strategy) => ({
      ...strategy,
      apy:
        poolStats.find((pool) => {
          return strategy.current_pool.length
            ? pool?.pool?.id ===
                getPoolId({
                  provider: pool.pool.provider,
                  token0: pool.pool.token0.symbol,
                  token1: pool.pool.token1.symbol,
                })
            : false;
        })?.apy ?? 0,
    }));
  }

  public async get_user_strategies(
    user: Principal
  ): Promise<Array<UserStrategyResponse>> {
    const anonymousActor = await getAnonActor<VaultType>(
      alfaACanister,
      idlFactory
    );
    const userStrategiesIds = (await anonymousActor.user_strategies(user)).map(
      (s) => s.strategy_id
    );
    return (await this.get_strategies()).filter((s) =>
      userStrategiesIds.includes(s.id)
    ) as unknown as Array<UserStrategyResponse>;
  }
}

export const strategiesService = new StrategiesService();
