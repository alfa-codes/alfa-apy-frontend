/* eslint-disable @typescript-eslint/no-explicit-any */
export const idlFactory = ({ IDL }: { IDL: any }) => {
  const Environment = IDL.Variant({
    'Dev' : IDL.Null,
    'Production' : IDL.Null,
    'Test' : IDL.Null,
    'Staging' : IDL.Null,
  });
  const RuntimeConfig = IDL.Record({ 'environment' : Environment });
  const TestLiquidityData = IDL.Record({
    'tx_id' : IDL.Nat64,
    'shares' : IDL.Nat,
    'amount' : IDL.Nat,
    'position_id' : IDL.Nat64,
  });
  const StrategyState = IDL.Record({
    'last_error' : IDL.Opt(IDL.Text),
    'initialize_attempts' : IDL.Nat32,
    'snapshot_cadence_secs' : IDL.Opt(IDL.Nat64),
    'initialized_at' : IDL.Opt(IDL.Nat64),
    'test_liquidity_data' : IDL.Opt(TestLiquidityData),
    'last_snapshot_at' : IDL.Opt(IDL.Nat64),
  });
  const GetStrategiesHistoryRequest = IDL.Record({
    'from_timestamp' : IDL.Opt(IDL.Nat64),
    'to_timestamp' : IDL.Opt(IDL.Nat64),
    'strategy_ids' : IDL.Opt(IDL.Vec(IDL.Nat16)),
  });
  const ExchangeId = IDL.Variant({
    'Sonic' : IDL.Null,
    'KongSwap' : IDL.Null,
    'ICPSwap' : IDL.Null,
  });
  const Pool = IDL.Record({
    'id' : IDL.Text,
    'provider' : ExchangeId,
    'token0' : IDL.Principal,
    'token1' : IDL.Principal,
  });
  const StrategySnapshot = IDL.Record({
    'id' : IDL.Text,
    'apy' : IDL.Float64,
    'test_liquidity_amount' : IDL.Opt(IDL.Nat),
    'current_liquidity_updated_at' : IDL.Opt(IDL.Nat64),
    'total_shares' : IDL.Nat,
    'strategy_id' : IDL.Nat16,
    'current_liquidity' : IDL.Opt(IDL.Nat),
    'timestamp' : IDL.Nat64,
    'current_pool' : IDL.Opt(Pool),
    'total_balance' : IDL.Nat,
    'users_count' : IDL.Nat32,
    'position_id' : IDL.Opt(IDL.Nat64),
  });
  const StrategyHistory = IDL.Record({
    'snapshots' : IDL.Vec(StrategySnapshot),
    'strategy_id' : IDL.Nat16,
  });
  const ResponseErrorKind = IDL.Variant({
    'AccessDenied' : IDL.Null,
    'Infrastructure' : IDL.Null,
    'NotFound' : IDL.Null,
    'Timeout' : IDL.Null,
    'Unknown' : IDL.Null,
    'BusinessLogic' : IDL.Null,
    'ExternalService' : IDL.Null,
    'Validation' : IDL.Null,
  });
  const ResponseError = IDL.Record({
    'code' : IDL.Nat64,
    'kind' : ResponseErrorKind,
    'message' : IDL.Text,
    'details' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
  });
  const GetStrategiesHistoryResult = IDL.Variant({
    'Ok' : IDL.Vec(StrategyHistory),
    'Err' : ResponseError,
  });
  const CreateTestSnapshotsRequest = IDL.Record({
    'from_timestamp' : IDL.Nat64,
    'min_apy' : IDL.Float64,
    'strategy_id' : IDL.Nat16,
    'to_timestamp' : IDL.Nat64,
    'max_apy' : IDL.Float64,
    'snapshot_interval_secs' : IDL.Nat64,
  });
  const CreateTestSnapshotsResponse = IDL.Record({
    'from_timestamp' : IDL.Nat64,
    'snapshots_created' : IDL.Nat64,
    'min_apy' : IDL.Float64,
    'actual_apy_range' : IDL.Tuple(IDL.Float64, IDL.Float64),
    'strategy_id' : IDL.Nat16,
    'to_timestamp' : IDL.Nat64,
    'max_apy' : IDL.Float64,
  });
  const CreateTestSnapshotsResult = IDL.Variant({
    'Ok' : CreateTestSnapshotsResponse,
    'Err' : ResponseError,
  });
  const InternalError = IDL.Record({
    'context' : IDL.Text,
    'code' : IDL.Nat64,
    'kind' : ResponseErrorKind,
    'extra' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
    'message' : IDL.Text,
  });
  const InitializeStrategyStatesAndCreateSnapshotsResponse = IDL.Record({
    'errors' : IDL.Vec(InternalError),
    'success_count' : IDL.Nat64,
  });
  const InitializeStrategyStatesAndCreateSnapshotsResult = IDL.Variant({
    'Ok' : InitializeStrategyStatesAndCreateSnapshotsResponse,
    'Err' : ResponseError,
  });
  const SaveStrategySnapshotResult = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : ResponseError,
  });
  return IDL.Service({
    'get_all_strategy_states' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat16, StrategyState))],
        ['query'],
      ),
    'get_runtime_config' : IDL.Func([], [RuntimeConfig], ['query']),
    'get_strategies_history' : IDL.Func(
        [GetStrategiesHistoryRequest],
        [GetStrategiesHistoryResult],
        ['query'],
      ),
    'get_strategy_snapshots_count' : IDL.Func(
        [IDL.Nat16],
        [IDL.Nat64],
        ['query'],
      ),
    'get_strategy_state' : IDL.Func(
        [IDL.Nat16],
        [IDL.Opt(StrategyState)],
        ['query'],
      ),
    'test_create_snapshots' : IDL.Func(
        [CreateTestSnapshotsRequest],
        [CreateTestSnapshotsResult],
        [],
      ),
    'test_delete_all_snapshots' : IDL.Func([], [], []),
    'test_delete_strategy_state' : IDL.Func([IDL.Nat16], [], []),
    'test_initialize_strategy_states_and_create_snapshots' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat16))],
        [InitializeStrategyStatesAndCreateSnapshotsResult],
        [],
      ),
    'test_save_strategy_snapshot' : IDL.Func(
        [StrategySnapshot],
        [SaveStrategySnapshotResult],
        [],
      ),
  });
};
export const init = ({ IDL }: { IDL: any }) => {
  const Environment = IDL.Variant({
    'Dev' : IDL.Null,
    'Production' : IDL.Null,
    'Test' : IDL.Null,
    'Staging' : IDL.Null,
  });
  const RuntimeConfig = IDL.Record({ 'environment' : Environment });
  return [IDL.Opt(RuntimeConfig)];
};
