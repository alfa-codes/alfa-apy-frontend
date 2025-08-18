import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ExchangeId = { 'Sonic' : null } |
  { 'KongSwap' : null } |
  { 'ICPSwap' : null };
export interface GetStrategiesHistoryRequest {
  'from_timestamp' : [] | [bigint],
  'to_timestamp' : [] | [bigint],
  'strategy_ids' : [] | [Uint16Array | number[]],
}
export type GetStrategiesHistoryResult = { 'Ok' : Array<StrategyHistory> } |
  { 'Err' : ResponseError };
export interface InitializeStrategyStatesAndCreateSnapshotsResponse {
  'errors' : Array<InternalError>,
  'success_count' : bigint,
}
export type InitializeStrategyStatesAndCreateSnapshotsResult = {
    'Ok' : InitializeStrategyStatesAndCreateSnapshotsResponse
  } |
  { 'Err' : ResponseError };
export interface InternalError {
  'context' : string,
  'code' : number,
  'kind' : ResponseErrorKind,
  'extra' : [] | [Array<[string, string]>],
  'message' : string,
}
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
  'test_liquidity_amount' : [] | [bigint],
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
export interface StrategyState {
  'last_error' : [] | [string],
  'initialize_attempts' : number,
  'snapshot_cadence_secs' : [] | [bigint],
  'initialized_at' : [] | [bigint],
  'test_liquidity_data' : [] | [TestLiquidityData],
  'last_snapshot_at' : [] | [bigint],
}
export interface TestLiquidityData {
  'tx_id' : bigint,
  'shares' : bigint,
  'amount' : bigint,
  'position_id' : bigint,
}
export interface _SERVICE {
  'get_all_strategy_states' : ActorMethod<[], Array<[number, StrategyState]>>,
  'get_strategies_history' : ActorMethod<
    [GetStrategiesHistoryRequest],
    GetStrategiesHistoryResult
  >,
  'get_strategy_snapshots_count' : ActorMethod<[number], bigint>,
  'get_strategy_state' : ActorMethod<[number], [] | [StrategyState]>,
  'test_delete_all_snapshots' : ActorMethod<[], undefined>,
  'test_delete_strategy_state' : ActorMethod<[number], undefined>,
  'test_initialize_strategy_states_and_create_snapshots' : ActorMethod<
    [],
    InitializeStrategyStatesAndCreateSnapshotsResult
  >,
  'test_save_strategy_snapshot' : ActorMethod<
    [StrategySnapshot],
    SaveStrategySnapshotResult
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
