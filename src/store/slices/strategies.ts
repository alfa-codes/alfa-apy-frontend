import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  strategiesService,
  StrategiesService,
} from "../../services/strategies/strategy-service";
import { Status } from "../types";
import { Agent } from "@dfinity/agent";
import { StrategyResponse } from "../../idl/vault";
import {
  poolStatsService,
  PoolStatsService,
} from "../../services/strategies/pool-stats.service";
import { GetPoolMetricsArgs } from "../../idl/pool_stats";
import { Principal } from "@dfinity/principal";

// Mock data for strategies
const MOCK_STRATEGIES: StrategyResponse[] = [
  {
    id: 1,
    name: "ICP-CHAT LP Strategy",
    description: "Earn rewards by providing liquidity to ICP-CHAT pair",
    total_shares: BigInt(1000),
    user_shares: [],
    initial_deposit: [],
    current_pool: 1,
    pools: [
      {
        tvl: BigInt(500000),
        lp_token_symbol: "ICP-CHAT-LP",
        name: "ICP/CHAT Pool",
        lp_fee_0: BigInt(0),
        lp_fee_1: BigInt(0),
        balance_0: BigInt(250000),
        balance_1: BigInt(250000),
        rolling_24h_volume: BigInt(100000),
        rolling_24h_apy: 15.2,
        address_0: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        address_1: "2ouva-viaaa-aaaaq-aaamq-cai",
        rolling_24h_num_swaps: BigInt(100),
        symbol_0: "ICP",
        symbol_1: "CHAT",
        pool_id: 1,
        price: 1.02,
        chain_0: "ICP",
        chain_1: "ICP",
        is_removed: false,
        symbol: "ICP-CHAT",
        rolling_24h_lp_fee: BigInt(1000),
        lp_fee_bps: 30,
        lastHarvest: Date.now() - 2 * 24 * 60 * 60 * 1000,
        provider: "IcpSwap",
      },
      {
        tvl: BigInt(500000),
        lp_token_symbol: "ICP-CHAT-LP",
        name: "ICP/CHAT Pool",
        lp_fee_0: BigInt(0),
        lp_fee_1: BigInt(0),
        balance_0: BigInt(250000),
        balance_1: BigInt(250000),
        rolling_24h_volume: BigInt(100000),
        rolling_24h_apy: 15.2,
        address_0: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        address_1: "2ouva-viaaa-aaaaq-aaamq-cai",
        rolling_24h_num_swaps: BigInt(100),
        symbol_0: "ICP",
        symbol_1: "CHAT",
        pool_id: 1,
        price: 1.02,
        chain_0: "ICP",
        chain_1: "ICP",
        is_removed: false,
        symbol: "ICP-CHAT",
        rolling_24h_lp_fee: BigInt(1000),
        lp_fee_bps: 30,
        lastHarvest: Date.now() - 2 * 24 * 60 * 60 * 1000,
        provider: "KongSwap",
      },
    ],
    tokens: ["ICP_CHAT"],
    created_at: Date.now() - 90 * 24 * 60 * 60 * 1000,
    protocol: "icp",
    strategyType: "lp",
    depositToken: "ICP_CHAT",
    rewardToken: "CHAT",
  },
  {
    id: 2,
    name: "ckBTC-ICP LP",
    description: "Provide liquidity to ckBTC-ICP pair",
    total_shares: BigInt(1000),
    user_shares: [],
    initial_deposit: [],
    current_pool: 3,
    pools: [
      {
        tvl: BigInt(250000),
        lp_token_symbol: "ckBTC-ICP-LP",
        name: "ckBTC/ICP Pool",
        lp_fee_0: BigInt(0),
        lp_fee_1: BigInt(0),
        balance_0: BigInt(125000),
        balance_1: BigInt(125000),
        rolling_24h_volume: BigInt(75000),
        rolling_24h_apy: 22.1,
        address_0: "mxzaz-hqaaa-aaaar-qaada-cai",
        address_1: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        rolling_24h_num_swaps: BigInt(75),
        symbol_0: "ckBTC",
        symbol_1: "ICP",
        pool_id: 3,
        price: 1.05,
        chain_0: "ICP",
        chain_1: "ICP",
        is_removed: false,
        symbol: "ckBTC-ICP",
        rolling_24h_lp_fee: BigInt(750),
        lp_fee_bps: 30,
        lastHarvest: Date.now() - 1 * 24 * 60 * 60 * 1000,
        provider: "IcpSwap",
      },
    ],
    tokens: ["ckBTC_ICP"],
    created_at: Date.now() - 60 * 24 * 60 * 60 * 1000,
    protocol: "icp",
    strategyType: "lp",
    depositToken: "ckBTC_ICP",
    rewardToken: "ckBTC",
  },
];

// Mock data for user balances
const MOCK_USER_BALANCES = {
  1: {
    strategy_id: 1,
    user_shares: 100,
    total_shares: 1000,
    price: "1.02",
    usd_balance: 1020,
    amount_0: 500,
    amount_1: 510,
  },
};

// Mock service implementation
const mockService = {
  get_strategies: async () => MOCK_STRATEGIES,
  get_user_strategies: async () => [],
  withdraw: async () => ({ current_shares: BigInt(0), amount: BigInt(0) }),
  accept_investment: async () => ({
    request_id: BigInt(0),
    tx_id: BigInt(0),
    shares: BigInt(0),
    amount: BigInt(0),
  }),
  get_user_data: async () => {
    return;
  },
};

export const fetchStrategies = createAsyncThunk(
  "strategies/fetch",
  async () => {
    try {
      const response = await strategiesService.get_strategies();
      console.log("strategies", response);
      return response;
    } catch (e) {
      console.error(e);
    }
  }
);

export const fetchUserStrategies = createAsyncThunk(
  "strategies/fetchUser",
  async (user: Principal) => {
    try {
      const response = await strategiesService.get_user_strategies(user);
      console.log("strategies", response);
      return response;
    } catch (e) {
      console.error(e);
    }
  }
);

export const fetchStrategiesBalances = createAsyncThunk(
  "strategies/fetchBalances",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  async (_params: any) => {
    // TODO: Uncomment when KongSwap is fixed
    // try {
    //   const balances = await StrategiesService.get_user_strategies(
    //     Principal.from(principal)
    //   );
    //   return balances.reduce(
    //     (acc, value) => ({
    //       ...acc,
    //       [value.strategy_id]: value,
    //     }),
    //     {}
    //   );
    // } catch (e) {
    //   console.error(e);
    // }

    // Using mock data for now
    return MOCK_USER_BALANCES;
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initStrategies = createAsyncThunk(
  "strategies/init",
  async (_agent?: Agent) => {
    // TODO: Uncomment when KongSwap is fixed
    // const response = await StrategiesService.build(agent);
    // return response;

    // Return mock service for now
    return mockService;
  }
);

const strategiesSlice = createSlice({
  name: "strategies",
  initialState: {
    strategies: {
      status: Status.IDLE,
    },
    userStrategies: {
      status: Status.IDLE,
    },
    service: {
      status: Status.IDLE,
    },
    balances: {
      status: Status.IDLE,
      data: {},
    },
  } as {
    strategies: {
      data?: Array<StrategyResponse>;
      status: Status;
      error?: string;
    };
    userStrategies: {
      data?: Array<StrategyResponse>;
      status: Status;
      error?: string;
    };
    service: {
      data?: StrategiesService;
      status: Status;
      error?: string;
    };
    balances: {
      data?: Record<
        string,
        {
          user_shares: number;
          total_shares: number;
          price: string;
          usd_balance: number;
          amount_0: number;
          amount_1: number;
        }
      >;
      status: Status;
      error?: string;
    };
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initStrategies.pending, (state) => {
        state.service.status = Status.LOADING;
      })
      .addCase(initStrategies.fulfilled, (state, action) => {
        state.service.status = Status.SUCCEEDED;
        state.service.data = action.payload;
      })
      .addCase(initStrategies.rejected, (state, action) => {
        state.service.status = Status.FAILED;
        state.service.error = action.error.message;
      })
      .addCase(fetchStrategies.pending, (state) => {
        state.strategies.status = Status.LOADING;
      })
      .addCase(fetchStrategies.fulfilled, (state, action) => {
        state.strategies.status = Status.SUCCEEDED;
        state.strategies.data = action.payload;
      })
      .addCase(fetchStrategies.rejected, (state, action) => {
        state.strategies.status = Status.FAILED;
        state.strategies.error = action.error.message;
      })
      .addCase(fetchUserStrategies.pending, (state) => {
        state.userStrategies.status = Status.LOADING;
      })
      .addCase(fetchUserStrategies.fulfilled, (state, action) => {
        state.userStrategies.status = Status.SUCCEEDED;
        state.userStrategies.data = action.payload;
      })
      .addCase(fetchUserStrategies.rejected, (state, action) => {
        state.userStrategies.status = Status.FAILED;
        state.userStrategies.error = action.error.message;
      })
      .addCase(fetchStrategiesBalances.pending, (state) => {
        state.balances.status = Status.LOADING;
      })
      .addCase(fetchStrategiesBalances.fulfilled, (state, action) => {
        state.strategies.status = Status.SUCCEEDED;
        state.balances.data = action.payload;
      })
      .addCase(fetchStrategiesBalances.rejected, (state, action) => {
        state.strategies.status = Status.FAILED;
        state.balances.error = action.error.message;
      });
  },
});

export const strategiesReducer = strategiesSlice.reducer;
