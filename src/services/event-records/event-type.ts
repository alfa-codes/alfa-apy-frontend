import { Event } from "../../idl/vault";
import { hasOwnProperty } from "../utils";

export enum EventRecordType {
  StrategyWithdrawCompleted = "StrategyWithdrawCompleted",
  StrategyWithdrawStarted = "StrategyWithdrawStarted",
  AddLiquidityToPoolFailed = "AddLiquidityToPoolFailed",
  AddLiquidityToPoolCompleted = "AddLiquidityToPoolCompleted",
  WithdrawLiquidityFromPoolStarted = "WithdrawLiquidityFromPoolStarted",
  SwapTokenFailed = "SwapTokenFailed",
  AddLiquidityToPoolStarted = "AddLiquidityToPoolStarted",
  StrategyDepositStarted = "StrategyDepositStarted",
  StrategyDepositCompleted = "StrategyDepositCompleted",
  StrategyRebalanceFailed = "StrategyRebalanceFailed",
  SwapTokenCompleted = "SwapTokenCompleted",
  WithdrawLiquidityFromPoolCompleted = "WithdrawLiquidityFromPoolCompleted",
  StrategyRebalanceStarted = "StrategyRebalanceStarted",
  StrategyRebalanceCompleted = "StrategyRebalanceCompleted",
  SwapTokenStarted = "SwapTokenStarted",
  StrategyWithdrawFailed = "StrategyWithdrawFailed",
  WithdrawLiquidityFromPoolFailed = "WithdrawLiquidityFromPoolFailed",
}

export function eventToEventRecordType(event: Event): EventRecordType {
  if (hasOwnProperty(event, "StrategyWithdrawCompleted")) {
    return EventRecordType.StrategyWithdrawCompleted;
  }
  if (hasOwnProperty(event, "StrategyWithdrawStarted")) {
    return EventRecordType.StrategyWithdrawStarted;
  }
  if (hasOwnProperty(event, "AddLiquidityToPoolFailed")) {
    return EventRecordType.AddLiquidityToPoolFailed;
  }
  if (hasOwnProperty(event, "AddLiquidityToPoolCompleted")) {
    return EventRecordType.AddLiquidityToPoolCompleted;
  }
  if (hasOwnProperty(event, "WithdrawLiquidityFromPoolStarted")) {
    return EventRecordType.WithdrawLiquidityFromPoolStarted;
  }
  if (hasOwnProperty(event, "SwapTokenFailed")) {
    return EventRecordType.SwapTokenFailed;
  }
  if (hasOwnProperty(event, "AddLiquidityToPoolStarted")) {
    return EventRecordType.AddLiquidityToPoolStarted;
  }
  if (hasOwnProperty(event, "StrategyDepositStarted")) {
    return EventRecordType.StrategyDepositStarted;
  }
  if (hasOwnProperty(event, "StrategyDepositCompleted")) {
    return EventRecordType.StrategyDepositCompleted;
  }
  if (hasOwnProperty(event, "StrategyRebalanceFailed")) {
    return EventRecordType.StrategyRebalanceFailed;
  }
  if (hasOwnProperty(event, "SwapTokenCompleted")) {
    return EventRecordType.SwapTokenCompleted;
  }
  if (hasOwnProperty(event, "WithdrawLiquidityFromPoolCompleted")) {
    return EventRecordType.WithdrawLiquidityFromPoolCompleted;
  }
  if (hasOwnProperty(event, "StrategyRebalanceStarted")) {
    return EventRecordType.StrategyRebalanceStarted;
  }
  if (hasOwnProperty(event, "SwapTokenStarted")) {
    return EventRecordType.SwapTokenStarted;
  }
  if (hasOwnProperty(event, "StrategyWithdrawFailed")) {
    return EventRecordType.StrategyWithdrawFailed;
  }
  if (hasOwnProperty(event, "WithdrawLiquidityFromPoolFailed")) {
    return EventRecordType.WithdrawLiquidityFromPoolFailed;
  }
  if (hasOwnProperty(event, "StrategyRebalanceCompleted")) {
    return EventRecordType.StrategyRebalanceCompleted;
  }
  return EventRecordType.StrategyWithdrawCompleted;
}
