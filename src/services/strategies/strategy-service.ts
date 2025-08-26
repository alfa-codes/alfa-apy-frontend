/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  _SERVICE as VaultType, ExchangeId as ExchangeIdResponse
} from "../../idl/vault";
import { idlFactory } from "../../idl/vault_idl";
import { Principal } from "@dfinity/principal";
import { getAnonActor } from "../utils";
import { poolStatsService } from "./pool-stats.service";
import { VAULT_CANISTER_ID } from "../../constants";
import { PoolMetrics } from "../../idl/pool_stats";
import { ExchangeId } from "./enum";
import { icrc1OracleService } from "../token";
import { ICRC1 } from "../../idl/icrc1_oracle";
import { exchangeRateService } from "../exchange/exchange-rate";

export interface Strategy  {
  id : number,
  name : string,
  description : string,
  totalShares : bigint,
  initialDeposit : Array<[Principal, bigint]>,
  userShares : Array<[Principal, bigint]>,
  currentPool : string | undefined,
  totalBalance : bigint,
  pools : Array<StrategyPool>,
  apy: number;
  tvl: bigint;
  usd_apy: number;
  getUserInitialDeposit(user: Principal): number;
}

export interface StrategyPool {
  id : string,
  provider : ExchangeId,
  price0: number | undefined,
  price1: number | undefined,
  token0 : ICRC1,
  token1 : ICRC1,
  tvl: bigint,
  apy: number,
  isActive: boolean,
}

export class StrategiesService {
  public async getStrategies(): Promise<Array<Strategy>> {
    const startTime = performance.now();
    console.log(`🚀 [PROFILER] Starting getStrategies`);
    
    // Получение стратегий
    const strategiesStart = performance.now();
    const strategies = await this.getStrategiesFromCanister();
    const strategiesEnd = performance.now();
    console.log(`📊 [PROFILER] get_strategies took ${(strategiesEnd - strategiesStart).toFixed(2)}ms`);

    console.log("strategies", strategies);

    // Получение цен токенов
    const pricesStart = performance.now();
    const price: Array<{ledger: string, price: number | undefined}> = (await Promise.all(strategies.map(async (strategy) => {
      const token0 = strategy.pools[0].token0.toText();
      const token1 = strategy.pools[0].token1.toText();
      const [price0, price1] = await Promise.all([
        exchangeRateService.usdPriceForICRC1(token0),
        exchangeRateService.usdPriceForICRC1(token1)
      ]);
      return [{ledger: token0, price: price0?.value.toNumber()},{ledger: token1, price: price1?.value.toNumber()}];
    }))).flat();
    const pricesEnd = performance.now();
    console.log(`💰 [PROFILER] Token prices fetch took ${(pricesEnd - pricesStart).toFixed(2)}ms`);

    // Параллельное получение данных
    const parallelStart = performance.now();
    const [icrc1Tokens , poolIds, prices] = await Promise.all([
      icrc1OracleService.getICRC1Canisters(),
      strategies.flatMap((strategy) =>
        strategy.pools.map((pool: StrategyPool) => pool.id)
      ),
      price
     ]);
    const parallelEnd = performance.now();
    console.log(`⚡ [PROFILER] Parallel data fetch took ${(parallelEnd - parallelStart).toFixed(2)}ms`);

    const icrc1TokensMap = new Map(icrc1Tokens.map((token) => [token.ledger, token]));
     
    // Получение статистики пулов
    const poolStatsStart = performance.now();
    const poolStats: [string, PoolMetrics][] =
      await poolStatsService.get_pool_metrics(poolIds);
    const poolStatsEnd = performance.now();
    console.log(`📈 [PROFILER] Pool stats fetch took ${(poolStatsEnd - poolStatsStart).toFixed(2)}ms`);
    
    console.log("poolStats", poolStats);
    
    // Маппинг данных
    const mappingStart = performance.now();
    const data: Strategy[] = strategies.map((strategy) => ({
      id: strategy.id,
      name: strategy.name,
      description: strategy.description,
      currentPool: strategy.current_pool[0]?.id,
      totalShares: strategy.total_shares,
      initialDeposit: strategy.initial_deposit,
      userShares: strategy.user_shares,
      totalBalance: strategy.total_balance,
      pools: strategy.pools.map((pool: any) => ({
        id: pool.id,
        provider: providerResponseToExchangeId(pool.provider),
        token0: icrc1TokensMap.get(pool.token0.toText())!,
        price0: prices.find((price) => price.ledger === pool.token0.toText())?.price,
        token1: icrc1TokensMap.get(pool.token1.toText())!,
        price1: prices.find((price) => price.ledger === pool.token1.toText())?.price,
        isActive: strategy.current_pool[0]?.id === pool.id,
        tvl: poolStats.find((poolSt) => {
          return poolSt[0] === pool.id;
        })?.[1].tvl ?? 0n,
        apy: poolStats.find((poolSt) => {
          return poolSt[0] === pool.id;
        })?.[1].apy.tokens_apy ?? 0,
      })),
      apy:
        poolStats.find((pool: any) => {
          const currentPool = strategy.current_pool[0]!;
          return pool[0] === currentPool.id;
        })?.[1].apy.tokens_apy ?? 0,
      tvl:
        strategy.current_liquidity[0] ?? 0n,
      usd_apy:
        poolStats.find((pool: any) => {
          const currentPool = strategy.current_pool[0]!;
          return pool[0] === currentPool.id;
        })?.[1].apy.usd_apy ?? 0,
      getUserInitialDeposit: (user: Principal) => {
        const initDeposit = strategy.initial_deposit.find(([principal]: [Principal, bigint]) => principal.toString() === user.toString())?.[1];
        const token0Str = strategy.pools[0].token0.toText();
        const decimals = icrc1TokensMap.get(token0Str)?.decimals ?? 0;
        if (!initDeposit) return 0;
        return Number(initDeposit) / Number(10 ** decimals);
      }
    }));

    const mappingEnd = performance.now();
    console.log(`🔄 [PROFILER] Data mapping took ${(mappingEnd - mappingStart).toFixed(2)}ms`);
    
    const totalTime = performance.now() - startTime;
    console.log(`🎯 [PROFILER] Total getStrategies execution time: ${totalTime.toFixed(2)}ms`);
    
    return data;
  }

  private async getStrategiesFromCanister(): Promise<any[]> {
    const anonymousActor = await getAnonActor<VaultType>(
      VAULT_CANISTER_ID,
      idlFactory
    );
    return await anonymousActor
      .get_strategies()
      .then((strategies) =>
        strategies.filter((strategy) => strategy.current_pool.length > 0)
      );
  }

  public async getUserStrategies(
    user: Principal
  ): Promise<Array<Strategy>> {
    const userStrategies = await this.getStrategies();
    return userStrategies.filter((strategy) => strategy.userShares.some(([principal]) => principal.toString() === user.toString()));
  }
}

export const strategiesService = new StrategiesService();

function providerResponseToExchangeId(provider: ExchangeIdResponse): ExchangeId {
  console.log("provider", provider);
  if (hasOwnProperty(provider, "KongSwap")) {
    return ExchangeId.KongSwap;
  } else if (hasOwnProperty(provider, "ICPSwap")) {
    return ExchangeId.ICPSwap;
  }
  throw new Error("Invalid provider");
}

// A `hasOwnProperty` that produces evidence for the typechecker
export function hasOwnProperty<
  X extends Record<string, unknown>,
  Y extends PropertyKey,
>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}