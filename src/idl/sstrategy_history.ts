import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ExchangeId = { 'Sonic' : null } |
  { 'KongSwap' : null } |
  { 'ICPSwap' : null };
export interface FetchAndSaveStrategiesResponse {
  'errors' : Array<string>,
  'success_count' : bigint,
}
export type FetchAndSaveStrategiesResult = {
    'Ok' : FetchAndSaveStrategiesResponse
  } |
  { 'Err' : ResponseError };
export interface GetStrategiesHistoryRequest {
  'from_timestamp' : [] | [bigint],
  'to_timestamp' : [] | [bigint],
  'strategy_ids' : [] | [Uint16Array | number[]],
}
export type GetStrategiesHistoryResult = { 'Ok' : Array<StrategyHistory> } |
  { 'Err' : ResponseError };
export interface Pool {
  'id' : string,
  'provider' : ExchangeId,
  'token0' : Principal,
  'token1' : Principal,
}
export interface ResponseError {
  'code' : number,
  'kind' : ResponseErrorKind,
  'message' : string,
  'details' : [] | [Array<[string, string]>],
}
export type ResponseErrorKind = { 'AccessDenied' : null } |
  { 'NotFound' : null } |
  { 'Timeout' : null } |
  { 'Unknown' : null } |
  { 'BusinessLogic' : null } |
  { 'ExternalService' : null } |
  { 'Validation' : null };
export type SaveStrategySnapshotResult = { 'Ok' : null } |
  { 'Err' : ResponseError };
export interface StrategyHistory {
  'snapshots' : Array<StrategySnapshot>,
  'strategy_id' : number,
}
export interface StrategySnapshot {
  'id' : string,
  'apy' : number,
  'current_liquidity_updated_at' : [] | [bigint],
  'total_shares' : bigint,
  'strategy_id' : number,
  'current_liquidity' : [] | [bigint],
  'timestamp' : bigint,
  'current_pool' : [] | [Pool],
  'total_balance' : bigint,
  'users_count' : number,
  'position_id' : [] | [bigint],
}
export interface _SERVICE {
  'fetch_and_save_strategies' : ActorMethod<[], FetchAndSaveStrategiesResult>,
  'get_strategies_history' : ActorMethod<
    [GetStrategiesHistoryRequest],
    GetStrategiesHistoryResult
  >,
  'get_strategy_snapshots_count' : ActorMethod<[number], bigint>,
  'save_strategy_snapshot' : ActorMethod<
    [StrategySnapshot],
    SaveStrategySnapshotResult
  >,
  'test_delete_all_snapshots' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
