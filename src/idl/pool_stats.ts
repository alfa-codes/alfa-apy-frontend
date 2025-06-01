import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AddLiquidityResponse {
  'request_id' : bigint,
  'token_0_amount' : bigint,
  'token_1_amount' : bigint,
}
export interface ApyValue { 'tokens_apy' : number, 'usd_apy' : number }
export type ExchangeId = { 'Sonic' : null } |
  { 'KongSwap' : null } |
  { 'ICPSwap' : null };
export interface GetPoolMetricsArgs {
  'provider' : ExchangeId,
  'token0' : TokenInfo,
  'token1' : TokenInfo,
}
export interface Pool {
  'id' : string,
  'provider' : ExchangeId,
  'token0' : TokenInfo,
  'token1' : TokenInfo,
  'position' : [] | [Position],
}
export interface PoolApy {
  'month' : ApyValue,
  'week' : ApyValue,
  'year' : ApyValue,
}
export interface PoolData { 'tvl' : bigint }
export interface PoolMetrics {
  'apy' : PoolApy,
  'pool' : Pool,
  'snapshots' : Array<PoolSnapshot>,
}
export interface PoolSnapshot {
  'pool_data' : [] | [PoolData],
  'timestamp' : bigint,
  'pool_id' : string,
  'position_data' : [] | [PositionData],
}
export interface Position {
  'id' : bigint,
  'initial_amount0' : bigint,
  'initial_amount1' : bigint,
}
export interface PositionData {
  'id' : bigint,
  'usd_amount0' : bigint,
  'usd_amount1' : bigint,
  'amount0' : bigint,
  'amount1' : bigint,
}
export type Result = { 'Ok' : AddLiquidityResponse } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : WithdrawFromPoolResponse } |
  { 'Err' : string };
export interface TokenInfo { 'ledger' : Principal, 'symbol' : string }
export interface WithdrawFromPoolResponse {
  'token_0_amount' : bigint,
  'token_1_amount' : bigint,
}
export interface _SERVICE {
  'add_liquidity_to_pool' : ActorMethod<[string, bigint], Result>,
  'add_pool' : ActorMethod<[TokenInfo, TokenInfo, ExchangeId], undefined>,
  'delete_pool' : ActorMethod<[TokenInfo, TokenInfo, ExchangeId], undefined>,
  'get_pool_by_tokens' : ActorMethod<
    [TokenInfo, TokenInfo, ExchangeId],
    [] | [Pool]
  >,
  'get_pool_metrics' : ActorMethod<
    [Array<GetPoolMetricsArgs>],
    Array<[] | [PoolMetrics]>
  >,
  'get_pools' : ActorMethod<[], Array<Pool>>,
  'remove_liquidity_from_pool' : ActorMethod<[string], Result_1>,
  'set_operator' : ActorMethod<[Principal], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
