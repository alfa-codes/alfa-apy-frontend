/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  _SERVICE as VaultType,
  StrategyResponse,
  UserStrategyResponse,
} from "../../idl/vault";
import { idlFactory } from "../../idl/vault_idl";
import { Principal } from "@dfinity/principal";
import { getAnonActor } from "../utils";
import { poolStatsService } from "./pool-stats.service";
import { tokensService } from "../tokens-service";
import { getPoolId } from "../../utils/pools";
import { VAULT_CANISTER_ID } from "../../constants";

export interface Strategy extends StrategyResponse {
  apy: number;
  tvl: number;
}

export class StrategiesService {
  public async get_strategies(): Promise<Array<StrategyResponse>> {
    const anonymousActor = await getAnonActor<VaultType>(
      VAULT_CANISTER_ID,
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
    console.log("poolMetricsArgs", poolMetricsArgs);
    const poolStats = await poolStatsService.get_pool_metrics(poolMetricsArgs);
    console.log("poolStats", poolStats);
    // Find the pool with the highest APY
    const maxApyPoolStat = poolStats.reduce((max, ps) => {
      return ps[1].apy > max[1].apy ? ps : max;
    }, poolStats[0]);
    const maxApyPoolId = getPoolId({
      provider: maxApyPoolStat[0].provider,
      token0: maxApyPoolStat[0].token0.symbol,
      token1: maxApyPoolStat[0].token1.symbol,
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
            ? getPoolId({
                provider: maxApyPoolStat[0].provider,
                token0: maxApyPoolStat[0].token0.symbol,
                token1: maxApyPoolStat[0].token1.symbol,
              }) ===
                getPoolId({
                  provider: pool[0].provider,
                  token0: pool[0].token0.symbol,
                  token1: pool[0].token1.symbol,
                })
            : false;
        })?.[1].apy ?? 0,
    }));
  }

  public async get_user_strategies(
    user: Principal
  ): Promise<Array<UserStrategyResponse>> {
    const anonymousActor = await getAnonActor<VaultType>(
      VAULT_CANISTER_ID,
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
