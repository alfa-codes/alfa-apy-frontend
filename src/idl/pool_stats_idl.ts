export const idlFactory = ({ IDL }) => {
    const AddLiquidityResponse = IDL.Record({
      'request_id' : IDL.Nat64,
      'token_0_amount' : IDL.Nat,
      'token_1_amount' : IDL.Nat,
    });
    const Result = IDL.Variant({ 'Ok' : AddLiquidityResponse, 'Err' : IDL.Text });
    const TokenInfo = IDL.Record({
      'ledger' : IDL.Principal,
      'symbol' : IDL.Text,
    });
    const ExchangeId = IDL.Variant({
      'Sonic' : IDL.Null,
      'KongSwap' : IDL.Null,
      'ICPSwap' : IDL.Null,
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
    const GetPoolMetricsArgs = IDL.Record({
      'provider' : ExchangeId,
      'token0' : TokenInfo,
      'token1' : TokenInfo,
    });
    const ApyValue = IDL.Record({
      'tokens_apy' : IDL.Float64,
      'usd_apy' : IDL.Float64,
    });
    const PoolApy = IDL.Record({
      'month' : ApyValue,
      'week' : ApyValue,
      'year' : ApyValue,
    });
    const PoolData = IDL.Record({ 'tvl' : IDL.Nat });
    const PositionData = IDL.Record({
      'id' : IDL.Nat,
      'usd_amount0' : IDL.Nat,
      'usd_amount1' : IDL.Nat,
      'amount0' : IDL.Nat,
      'amount1' : IDL.Nat,
    });
    const PoolSnapshot = IDL.Record({
      'pool_data' : IDL.Opt(PoolData),
      'timestamp' : IDL.Nat64,
      'pool_id' : IDL.Text,
      'position_data' : IDL.Opt(PositionData),
    });
    const PoolMetrics = IDL.Record({
      'apy' : PoolApy,
      'pool' : Pool,
      'snapshots' : IDL.Vec(PoolSnapshot),
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
      'add_pool' : IDL.Func([TokenInfo, TokenInfo, ExchangeId], [], []),
      'delete_pool' : IDL.Func([TokenInfo, TokenInfo, ExchangeId], [], []),
      'get_pool_by_tokens' : IDL.Func(
          [TokenInfo, TokenInfo, ExchangeId],
          [IDL.Opt(Pool)],
          [],
        ),
      'get_pool_metrics' : IDL.Func(
          [IDL.Vec(GetPoolMetricsArgs)],
          [IDL.Vec(IDL.Opt(PoolMetrics))],
          [],
        ),
      'get_pools' : IDL.Func([], [IDL.Vec(Pool)], []),
      'remove_liquidity_from_pool' : IDL.Func([IDL.Text], [Result_1], []),
      'set_operator' : IDL.Func([IDL.Principal], [], []),
    });
  };
  