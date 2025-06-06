/* eslint-disable @typescript-eslint/no-explicit-any */
export const idlFactory = ({ IDL }: { IDL: any }) => {
  const AddLiquidityResponse = IDL.Record({
    'request_id' : IDL.Nat64,
    'token_0_amount' : IDL.Nat,
    'token_1_amount' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'Ok' : AddLiquidityResponse, 'Err' : IDL.Text });
  const ExchangeId = IDL.Variant({
    'Sonic' : IDL.Null,
    'KongSwap' : IDL.Null,
    'ICPSwap' : IDL.Null,
  });
  const TokenInfo = IDL.Record({
    'ledger' : IDL.Principal,
    'symbol' : IDL.Text,
  });
  const PoolByTokens = IDL.Record({
    'provider' : ExchangeId,
    'token0' : TokenInfo,
    'token1' : TokenInfo,
  });
  const PoolData = IDL.Record({ 'tvl' : IDL.Nat });
  const PositionData = IDL.Record({
    'id' : IDL.Nat,
    'usd_amount0' : IDL.Nat,
    'usd_amount1' : IDL.Nat,
    'amount0' : IDL.Nat,
    'amount1' : IDL.Nat,
  });
  const PoolSnapshotArgs = IDL.Record({
    'pool_data' : IDL.Opt(PoolData),
    'timestamp' : IDL.Nat64,
    'pool_id' : IDL.Text,
    'position_data' : IDL.Opt(PositionData),
  });
  const Position = IDL.Record({
    'id' : IDL.Nat,
    'initial_amount0' : IDL.Nat,
    'initial_amount1' : IDL.Nat,
  });
  const Pool = IDL.Record({
    'id' : IDL.Text,
    'provider' : ExchangeId,
    'token0' : TokenInfo,
    'token1' : TokenInfo,
    'position' : IDL.Opt(Position),
  });
  const ApyValue = IDL.Record({ 'tokens_apy' : IDL.Nat, 'usd_apy' : IDL.Nat });
  const PoolApy = IDL.Record({
    'month' : ApyValue,
    'week' : ApyValue,
    'year' : ApyValue,
  });
  const PoolMetrics = IDL.Record({ 'apy' : PoolApy, 'tvl' : IDL.Nat });
  const PoolSnapshot = IDL.Record({
    'id' : IDL.Text,
    'pool_data' : IDL.Opt(PoolData),
    'timestamp' : IDL.Nat64,
    'pool_id' : IDL.Text,
    'position_data' : IDL.Opt(PositionData),
  });
  const WithdrawFromPoolResponse = IDL.Record({
    'token_0_amount' : IDL.Nat,
    'token_1_amount' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({
    'Ok' : WithdrawFromPoolResponse,
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'add_liquidity_to_pool' : IDL.Func([IDL.Text, IDL.Nat], [Result], []),
    'add_pool' : IDL.Func([PoolByTokens], [], []),
    'add_pool_snapshot' : IDL.Func([PoolSnapshotArgs], [], []),
    'delete_pool' : IDL.Func([PoolByTokens], [], []),
    'delete_pool_snapshot' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'delete_pool_snapshots' : IDL.Func([IDL.Text], [], []),
    'get_pool_by_tokens' : IDL.Func([PoolByTokens], [IDL.Opt(Pool)], []),
    'get_pool_metrics' : IDL.Func(
        [IDL.Vec(PoolByTokens)],
        [IDL.Vec(IDL.Tuple(PoolByTokens, PoolMetrics))],
        [],
      ),
    'get_pools' : IDL.Func([], [IDL.Vec(Pool)], []),
    'get_pools_snapshots' : IDL.Func(
        [IDL.Vec(PoolByTokens)],
        [IDL.Vec(IDL.Tuple(PoolByTokens, IDL.Vec(PoolSnapshot)))],
        [],
      ),
    'remove_liquidity_from_pool' : IDL.Func([IDL.Text], [Result_1], []),
    'set_operator' : IDL.Func([IDL.Principal], [], []),
  });
};
