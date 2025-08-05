/* eslint-disable @typescript-eslint/no-explicit-any */
export const idlFactory = ({ IDL }: { IDL: any }) => {
  const FetchAndSaveStrategiesResponse = IDL.Record({
    'errors' : IDL.Vec(IDL.Text),
    'success_count' : IDL.Nat64,
  });
  const ResponseErrorKind = IDL.Variant({
    'AccessDenied' : IDL.Null,
    'NotFound' : IDL.Null,
    'Timeout' : IDL.Null,
    'Unknown' : IDL.Null,
    'BusinessLogic' : IDL.Null,
    'ExternalService' : IDL.Null,
    'Validation' : IDL.Null,
  });
  const ResponseError = IDL.Record({
    'code' : IDL.Nat32,
    'kind' : ResponseErrorKind,
    'message' : IDL.Text,
    'details' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
  });
  const FetchAndSaveStrategiesResult = IDL.Variant({
    'Ok' : FetchAndSaveStrategiesResponse,
    'Err' : ResponseError,
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
  const GetLatestSnapshotResult = IDL.Variant({
    'Ok' : IDL.Opt(StrategySnapshot),
    'Err' : ResponseError,
  });
  const GetStrategiesHistoryRequest = IDL.Record({
    'from_timestamp' : IDL.Opt(IDL.Nat64),
    'to_timestamp' : IDL.Opt(IDL.Nat64),
    'strategy_ids' : IDL.Opt(IDL.Vec(IDL.Nat16)),
  });
  const StrategyHistoryResponse = IDL.Record({
    'snapshots' : IDL.Vec(StrategySnapshot),
    'strategy_id' : IDL.Nat16,
    'total_count' : IDL.Nat64,
  });
  const GetStrategiesHistoryResult = IDL.Variant({
    'Ok' : IDL.Vec(StrategyHistoryResponse),
    'Err' : ResponseError,
  });
  const SaveStrategySnapshotResult = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : ResponseError,
  });
  return IDL.Service({
    'fetch_and_save_strategies' : IDL.Func(
        [],
        [FetchAndSaveStrategiesResult],
        [],
      ),
    'get_all_strategy_snapshots' : IDL.Func(
        [IDL.Nat16],
        [IDL.Vec(StrategySnapshot)],
        ['query'],
      ),
    'get_latest_snapshot' : IDL.Func(
        [IDL.Nat16],
        [GetLatestSnapshotResult],
        ['query'],
      ),
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
    'save_strategy_snapshot' : IDL.Func(
        [StrategySnapshot],
        [SaveStrategySnapshotResult],
        [],
      ),
    'test_delete_all_snapshots' : IDL.Func([], [], []),
  });
};
