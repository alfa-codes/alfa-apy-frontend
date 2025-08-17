import { useEffect } from "react";
import {
  deposit,
  fetchPools,
  resetPools,
  Status,
  useDispatch,
  useSelector,
  withdraw,
  fetchStrategies
} from "../store";
import { useStrategies } from "./strategies";
import toaster from "../components/ui/toast";
import { useBalances } from "./balances";
import { useTokens } from "./tokens";
import { ICRC1 } from "../idl/icrc1_oracle";

export function usePools(pools_symbols: string[])  {
  const dispatch = useDispatch();

  const {
    fetchPools: { pools, status },
  } = useSelector((state) => state.strategy);

  useEffect(() => {
    if (status === Status.IDLE && !pools.length)
      dispatch(fetchPools());
  }, [status, pools, dispatch, pools_symbols]);

  return {
    pools,
    resetPools: () => dispatch(resetPools()),
  };
}

export function useDeposit() {
  const dispatch = useDispatch();
  const { refetchBalanceByCanister } = useBalances();
  const { tokens } = useTokens();

  const {
    deposit: { status, error },
  } = useSelector((state) => state.strategy);

  useEffect(() => {
    if (status === Status.SUCCEEDED) {
      dispatch(fetchStrategies());
      // Update token balances
      if (tokens?.length) {
        tokens.forEach((token: ICRC1) => {
          refetchBalanceByCanister(token);
        });
      }
    } else if (status === Status.FAILED && error) {
      toaster.error(error);
    }
  }, [status, error, dispatch, tokens, refetchBalanceByCanister]);

  return {
    deposit: (...params: Parameters<typeof deposit>) =>
      dispatch(deposit(...params)),
    isDepositing: status === Status.LOADING,
    depositDisabled: !useStrategies().service,
  };
}

export function useWithdraw() {
  const dispatch = useDispatch();
  const { refetchBalanceByCanister } = useBalances();
  const { tokens } = useTokens();

  const {
    withdraw: { status, error },
  } = useSelector((state) => state.strategy);

  useEffect(() => {
    if (status === Status.SUCCEEDED) {
      dispatch(fetchStrategies());
      // Update token balances
      if (tokens?.length) {
        tokens.forEach((token: ICRC1) => {
          refetchBalanceByCanister(token);
        });
      }
    } else if (status === Status.FAILED && error) {
      toaster.error(error);
    }
  }, [status, error, dispatch, tokens, refetchBalanceByCanister]);

  return {
    withdraw: (...params: Parameters<typeof deposit>) =>
      dispatch(withdraw(...params)),
    isWithdrawing: status === Status.LOADING,
    withdrawDisabled: !useStrategies().service,
  };
}
