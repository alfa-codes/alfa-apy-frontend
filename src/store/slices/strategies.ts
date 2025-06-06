import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  strategiesService,
  StrategiesService,
} from "../../services/strategies/strategy-service";
import { Status } from "../types";
import { Agent } from "@dfinity/agent";
import { StrategyResponse } from "../../idl/vault";
import { Principal } from "@dfinity/principal";

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
    return strategiesService;
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
    // userStrategies: {
    //   data?: Array<UserStrategyResponse>;
    //   status: Status;
    //   error?: string;
    // };
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
      // .addCase(fetchStrategies.rejected, (state, action) => {
      //   state.strategies.status = Status.FAILED;
      //   state.strategies.error = action.error.message;
      // })
      // .addCase(fetchUserStrategies.pending, (state) => {
      //   state.userStrategies.status = Status.LOADING;
      // })
      // .addCase(fetchUserStrategies.fulfilled, (state, action) => {
      //   state.userStrategies.status = Status.SUCCEEDED;
      //   state.userStrategies.data = action.payload;
      // })
      // .addCase(fetchUserStrategies.rejected, (state, action) => {
      //   state.userStrategies.status = Status.FAILED;
      //   state.userStrategies.error = action.error.message;
      // })
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
