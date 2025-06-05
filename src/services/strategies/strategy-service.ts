/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  _SERVICE as VaultType,
  StrategyResponse,
  UserStrategyResponse,
  DepositResponse,
  WithdrawResponse,
} from "../../idl/vault";
import { idlFactory } from "../../idl/vault_idl";
import { Principal } from "@dfinity/principal";
import { getAnonActor } from "../utils";
import { poolStatsService } from "./pool-stats.service";
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
    const strategies = await anonymousActor.get_strategies()
      .then((strategies) => strategies.filter((strategy) => strategy.current_pool.length > 0));

    const poolMetricsArgs = await Promise.all(
      strategies.flatMap((strategy) =>
        strategy.pools.map((pool) => {
          return {
            provider: pool.provider,
            token0: pool.token0,
            token1: pool.token1,
          };
        })
      )
    );
    console.log("poolMetricsArgs", poolMetricsArgs);

    const poolStats = await poolStatsService.get_pool_metrics(poolMetricsArgs);
    console.log("poolStats", poolStats);

    return strategies.map((strategy) => ({
      ...strategy,
      apy:
        poolStats.find((pool) => {
          const currentPool = strategy.current_pool[0]!;

          return strategy.current_pool.length
            ? getPoolId({
                provider: currentPool.provider,
                token0: currentPool.token0.symbol,
                token1: currentPool.token1.symbol,
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

  public async accept_investment(
    strategy_id: number,
    ledger: string,
    amount: bigint,
  ) : Promise<DepositResponse> {
    const anonymousActor = await getAnonActor<VaultType>(
      VAULT_CANISTER_ID,
      idlFactory
    );

    return await anonymousActor.accept_investment({
      strategy_id,
      ledger: Principal.fromText(ledger),
      amount,
    });
  }

  public async withdraw(
    strategy_id: number,
    ledger: string,
    amount: bigint,
  ) : Promise<WithdrawResponse> {
    const anonymousActor = await getAnonActor<VaultType>(
      VAULT_CANISTER_ID,
      idlFactory
    );

    return await anonymousActor.withdraw({
      strategy_id,
      ledger: Principal.fromText(ledger),
      amount,
    });
  }
}

export const strategiesService = new StrategiesService();
