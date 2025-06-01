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
    let strategies = await anonymousActor.get_strategies();
    strategies = strategies.filter((s) => s.id === 4);
    console.log("strategies", strategies);
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
    console.log("poolMetricsArgs", poolMetricsArgs);
    const poolStats = await poolStatsService.get_pool_metrics(poolMetricsArgs);
    console.log("poolStats", poolStats);
    // Find the pool with the highest APY
    const maxApyPoolStat = poolStats.reduce(
      (max, ps) => (ps[1].apy > max[1].apy ? ps : max),
      poolStats[0]
    );
    const maxApyPoolId = getPoolId({
      provider: maxApyPoolStat[1].pool.provider,
      token0: maxApyPoolStat[1].pool.token0.symbol,
      token1: maxApyPoolStat[1].pool.token1.symbol,
    });
    return strategies.map((strategy) => ({
      ...strategy,
      current_pool: (() => {
        const found = strategy.pools.find((p) => getPoolId(p) === maxApyPoolId);
        return found
          ? [
              {
                provider: found.provider,
                token0: {
                  symbol: found.token0,
                  ledger: Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"),
                },
                token1: {
                  symbol: found.token1,
                  ledger: Principal.fromText("druyg-tyaaa-aaaaq-aactq-cai"),
                },
              },
            ]
          : [];
      })(),
      apy:
        poolStats.find((pool) => {
          return strategy.current_pool.length
            ? pool?.[1].pool?.id ===
                getPoolId({
                  provider: pool[1].pool.provider,
                  token0: pool[1].pool.token0.symbol,
                  token1: pool[1].pool.token1.symbol,
                })
            : false;
        })?.[1].apy ?? 0,
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
