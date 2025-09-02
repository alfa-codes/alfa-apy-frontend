import { Event } from "../../idl/vault";

export interface EventDetails {
  type: string;
  fields: Array<{
    name: string;
    value: string | number | null;
    type: string;
    description?: string;
  }>;
  summary: string;
}

export class EventDetailsService {
  /**
   * Извлекает детали события из Event union типа
   */
  public extractEventDetails(event: Event): EventDetails {
    if ('StrategyWithdrawCompleted' in event) {
      return this.mapStrategyWithdrawCompleted(event.StrategyWithdrawCompleted);
    } else if ('StrategyWithdrawStarted' in event) {
      return this.mapStrategyWithdrawStarted(event.StrategyWithdrawStarted);
    } else if ('AddLiquidityToPoolFailed' in event) {
      return this.mapAddLiquidityToPoolFailed(event.AddLiquidityToPoolFailed);
    } else if ('AddLiquidityToPoolCompleted' in event) {
      return this.mapAddLiquidityToPoolCompleted(event.AddLiquidityToPoolCompleted);
    } else if ('WithdrawLiquidityFromPoolStarted' in event) {
      return this.mapWithdrawLiquidityFromPoolStarted(event.WithdrawLiquidityFromPoolStarted);
    } else if ('SwapTokenFailed' in event) {
      return this.mapSwapTokenFailed(event.SwapTokenFailed);
    } else if ('AddLiquidityToPoolStarted' in event) {
      return this.mapAddLiquidityToPoolStarted(event.AddLiquidityToPoolStarted);
    } else if ('StrategyDepositStarted' in event) {
      return this.mapStrategyDepositStarted(event.StrategyDepositStarted);
    } else if ('StrategyDepositCompleted' in event) {
      return this.mapStrategyDepositCompleted(event.StrategyDepositCompleted);
    } else if ('StrategyRebalanceFailed' in event) {
      return this.mapStrategyRebalanceFailed(event.StrategyRebalanceFailed);
    } else if ('SwapTokenCompleted' in event) {
      return this.mapSwapTokenCompleted(event.SwapTokenCompleted);
    } else if ('WithdrawLiquidityFromPoolCompleted' in event) {
      return this.mapWithdrawLiquidityFromPoolCompleted(event.WithdrawLiquidityFromPoolCompleted);
    } else if ('StrategyRebalanceStarted' in event) {
      return this.mapStrategyRebalanceStarted(event.StrategyRebalanceStarted);
    } else if ('SwapTokenStarted' in event) {
      return this.mapSwapTokenStarted(event.SwapTokenStarted);
    } else if ('StrategyWithdrawFailed' in event) {
      return this.mapStrategyWithdrawFailed(event.StrategyWithdrawFailed);
    } else if ('WithdrawLiquidityFromPoolFailed' in event) {
      return this.mapWithdrawLiquidityFromPoolFailed(event.WithdrawLiquidityFromPoolFailed);
    } else if ('StrategyRebalanceCompleted' in event) {
      return this.mapStrategyRebalanceCompleted(event.StrategyRebalanceCompleted);
    } else if ('StrategyDepositFailed' in event) {
      return this.mapStrategyDepositFailed(event.StrategyDepositFailed);
    } else {
      return {
        type: "Unknown Event",
        fields: [],
        summary: "Unknown event type"
      };
    }
  }

  private mapStrategyWithdrawCompleted(event: any): EventDetails {
    return {
      type: "Strategy Withdraw Completed",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Shares", value: event.shares?.[0]?.toString() || "N/A", type: "bigint", description: "Number of shares withdrawn" },
        { name: "Amount 0", value: event.amount0?.[0]?.toString() || "N/A", type: "bigint", description: "Amount of token 0 withdrawn" },
        { name: "Pool ID", value: event.pool_id?.[0] || "N/A", type: "string" }
      ],
      summary: `Successfully withdraw ${event.shares?.[0]?.toString() || "0"} shares from strategy ${event.strategy_id}`
    };
  }

  private mapStrategyWithdrawStarted(event: any): EventDetails {
    return {
      type: "Strategy Withdraw Started",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Shares", value: event.shares?.[0]?.toString() || "N/A", type: "bigint", description: "Number of shares to withdraw" },
        { name: "Pool ID", value: event.pool_id?.[0] || "N/A", type: "string" }
      ],
      summary: `Started withdrawal of ${event.shares?.[0]?.toString() || "0"} shares from strategy ${event.strategy_id}`
    };
  }

  private mapStrategyDepositStarted(event: any): EventDetails {
    return {
      type: "Strategy Deposit Started",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Amount 0", value: event.amount0?.[0]?.toString() || "N/A", type: "bigint", description: "Amount of token 0 to deposit" },
        { name: "Pool ID", value: event.pool_id?.[0] || "N/A", type: "string" }
      ],
      summary: `Started deposit of ${event.amount0?.[0]?.toString() || "0"} tokens into strategy ${event.strategy_id}`
    };
  }

  private mapStrategyDepositCompleted(event: any): EventDetails {
    return {
      type: "Strategy Deposit Completed",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Amount 0", value: event.amount0?.[0]?.toString() || "N/A", type: "bigint", description: "Amount of token 0 deposited" },
        { name: "Pool ID", value: event.pool_id?.[0] || "N/A", type: "string" }
      ],
      summary: `Successfully deposited ${event.amount0?.[0]?.toString() || "0"} tokens into strategy ${event.strategy_id}`
    };
  }

  private mapStrategyDepositFailed(event: any): EventDetails {
    return {
      type: "Strategy Deposit Failed",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Amount 0", value: event.amount0?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id?.[0] || "N/A", type: "string" },
        { name: "Error Code", value: event.error?.code?.toString() || "N/A", type: "number" },
        { name: "Error Message", value: event.error?.message || "N/A", type: "string" }
      ],
      summary: `Failed to deposit into strategy ${event.strategy_id}: ${event.error?.message || "Unknown error"}`
    };
  }

  private mapStrategyWithdrawFailed(event: any): EventDetails {
    return {
      type: "Strategy Withdraw Failed",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Shares", value: event.shares?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id?.[0] || "N/A", type: "string" },
        { name: "Error Code", value: event.error?.code?.toString() || "N/A", type: "number" },
        { name: "Error Message", value: event.error?.message || "N/A", type: "string" }
      ],
      summary: `Failed to withdraw from strategy ${event.strategy_id}: ${event.error?.message || "Unknown error"}`
    };
  }

  private mapStrategyRebalanceStarted(event: any): EventDetails {
    return {
      type: "Strategy Rebalance Started",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Previous Pool ID", value: event.previous_pool_id?.[0] || "N/A", type: "string" }
      ],
      summary: `Started rebalancing strategy ${event.strategy_id} from pool ${event.previous_pool_id?.[0] || "N/A"}`
    };
  }

  private mapStrategyRebalanceCompleted(event: any): EventDetails {
    return {
      type: "Strategy Rebalance Completed",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Previous Pool ID", value: event.previous_pool_id?.[0] || "N/A", type: "string" },
        { name: "New Pool ID", value: event.new_pool_id?.[0] || "N/A", type: "string" }
      ],
      summary: `Successfully rebalanced strategy ${event.strategy_id} from pool ${event.previous_pool_id?.[0] || "N/A"} to pool ${event.new_pool_id?.[0] || "N/A"}`
    };
  }

  private mapStrategyRebalanceFailed(event: any): EventDetails {
    return {
      type: "Strategy Rebalance Failed",
      fields: [
        { name: "Strategy ID", value: event.strategy_id, type: "string" },
        { name: "Previous Pool ID", value: event.previous_pool_id?.[0] || "N/A", type: "string" },
        { name: "New Pool ID", value: event.new_pool_id?.[0] || "N/A", type: "string" },
        { name: "Error Code", value: event.error?.code?.toString() || "N/A", type: "number" },
        { name: "Error Message", value: event.error?.message || "N/A", type: "string" }
      ],
      summary: `Failed to rebalance strategy ${event.strategy_id}: ${event.error?.message || "Unknown error"}`
    };
  }

  private mapSwapTokenStarted(event: any): EventDetails {
    return {
      type: "Swap Token Started",
      fields: [
        { name: "Token In", value: event.token_in?.toString() || "N/A", type: "Principal" },
        { name: "Amount In", value: event.amount_in?.toString() || "N/A", type: "bigint" },
        { name: "Token Out", value: event.token_out?.toString() || "N/A", type: "Principal" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" }
      ],
      summary: `Started swapping ${event.amount_in?.toString() || "0"} tokens from ${event.token_in?.toString() || "N/A"} to ${event.token_out?.toString() || "N/A"}`
    };
  }

  private mapSwapTokenCompleted(event: any): EventDetails {
    return {
      type: "Swap Token Completed",
      fields: [
        { name: "Token In", value: event.token_in?.toString() || "N/A", type: "Principal" },
        { name: "Amount In", value: event.amount_in?.toString() || "N/A", type: "bigint" },
        { name: "Token Out", value: event.token_out?.toString() || "N/A", type: "Principal" },
        { name: "Amount Out", value: event.amount_out?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" }
      ],
      summary: `Successfully swapped ${event.amount_in?.toString() || "0"} tokens for ${event.amount_out?.[0]?.toString() || "0"} tokens`
    };
  }

  private mapSwapTokenFailed(event: any): EventDetails {
    return {
      type: "Swap Token Failed",
      fields: [
        { name: "Token In", value: event.token_in?.toString() || "N/A", type: "Principal" },
        { name: "Amount In", value: event.amount_in?.toString() || "N/A", type: "bigint" },
        { name: "Token Out", value: event.token_out?.toString() || "N/A", type: "Principal" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" },
        { name: "Error Code", value: event.error?.code?.toString() || "N/A", type: "number" },
        { name: "Error Message", value: event.error?.message || "N/A", type: "string" }
      ],
      summary: `Failed to swap tokens: ${event.error?.message || "Unknown error"}`
    };
  }

  private mapAddLiquidityToPoolStarted(event: any): EventDetails {
    return {
      type: "Add Liquidity to Pool Started",
      fields: [
        { name: "Amount 0", value: event.amount0?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Amount 1", value: event.amount1?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" }
      ],
      summary: `Started adding liquidity: ${event.amount0?.[0]?.toString() || "0"} token0 + ${event.amount1?.[0]?.toString() || "0"} token1`
    };
  }

  private mapAddLiquidityToPoolCompleted(event: any): EventDetails {
    return {
      type: "Add Liquidity to Pool Completed",
      fields: [
        { name: "Amount 0", value: event.amount0?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Amount 1", value: event.amount1?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" }
      ],
      summary: `Successfully added liquidity: ${event.amount0?.[0]?.toString() || "0"} token0 + ${event.amount1?.[0]?.toString() || "0"} token1`
    };
  }

  private mapAddLiquidityToPoolFailed(event: any): EventDetails {
    return {
      type: "Add Liquidity to Pool Failed",
      fields: [
        { name: "Amount 0", value: event.amount0?.[0]?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" },
        { name: "Error Code", value: event.error?.code?.toString() || "N/A", type: "number" },
        { name: "Error Message", value: event.error?.message || "N/A", type: "string" }
      ],
      summary: `Failed to add liquidity: ${event.error?.message || "Unknown error"}`
    };
  }

  private mapWithdrawLiquidityFromPoolStarted(event: any): EventDetails {
    return {
      type: "Withdraw Liquidity from Pool Started",
      fields: [
        { name: "Shares", value: event.shares?.toString() || "N/A", type: "bigint" },
        { name: "Total Shares", value: event.total_shares?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" }
      ],
      summary: `Started withdrawing ${event.shares?.toString() || "0"} shares from pool ${event.pool_id || "N/A"}`
    };
  }

  private mapWithdrawLiquidityFromPoolCompleted(event: any): EventDetails {
    return {
      type: "Withdraw Liquidity from Pool Completed",
      fields: [
        { name: "Shares", value: event.shares?.toString() || "N/A", type: "bigint" },
        { name: "Total Shares", value: event.total_shares?.toString() || "N/A", type: "bigint" },
        { name: "Amount Token 0", value: event.amount_token0?.toString() || "N/A", type: "bigint" },
        { name: "Amount Token 1", value: event.amount_token1?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" }
      ],
      summary: `Successfully withdrew ${event.shares?.toString() || "0"} shares, received ${event.amount_token0?.toString() || "0"} token0 + ${event.amount_token1?.toString() || "0"} token1`
    };
  }

  private mapWithdrawLiquidityFromPoolFailed(event: any): EventDetails {
    return {
      type: "Withdraw Liquidity from Pool Failed",
      fields: [
        { name: "Shares", value: event.shares?.toString() || "N/A", type: "bigint" },
        { name: "Total Shares", value: event.total_shares?.toString() || "N/A", type: "bigint" },
        { name: "Pool ID", value: event.pool_id || "N/A", type: "string" },
        { name: "Error Code", value: event.error?.code?.toString() || "N/A", type: "number" },
        { name: "Error Message", value: event.error?.message || "N/A", type: "string" }
      ],
      summary: `Failed to withdraw liquidity: ${event.error?.message || "Unknown error"}`
    };
  }
}

export const eventDetailsService = new EventDetailsService();
