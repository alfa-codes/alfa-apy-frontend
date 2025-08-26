import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  strategiesService,
  StrategiesService,
  Strategy,
} from "../../services/strategies/strategy-service";
import { Status } from "../types";
import { Agent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";

// Mock data for user balances
const MOCK_USER_BALANCES = {
  1: {
    strategy_id: 1,
    user_shares: 100,
    total_shares: 1000,
    initial_deposit: 10n,
  },
}

export const fetchStrategies = createAsyncThunk(
  "strategies/fetch",
  async () => {
    try {
      const response : Array<Strategy> = await strategiesService.getStrategies();
      console.log("response", response);
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
      console.log("user11111", user);
      const response = await strategiesService.getUserStrategies(user);
      console.log("user strategies", response);

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
    try {
      // const balances = await strategiesService.getUserStrategies(
      //   Principal.from(_params.principal)
      // );



      // // const mappedBalances: Record<number, Strategy> = balances.reduce(
      //   (acc, value) => ({
      //     ...acc,
      //     [value.id]: value,
      //   }),
      //   {}
      // );

      // debugger;

      // Using mock data for now
      return MOCK_USER_BALANCES;

      // return mappedBalances;
    } catch (e) {
      console.error(e);
    }
  }
);

export const refreshDataAfterOperation = createAsyncThunk(
  "strategies/refreshData",
  async (user: Principal) => {
    try {
      // Обновляем стратегии
      const strategies = await strategiesService.getStrategies();
      
      // Обновляем балансы пользователя
      const userStrategies = await strategiesService.getUserStrategies(user);
      
      // Преобразуем в правильный формат для balances
      const balances = userStrategies.reduce((acc, strategy) => {
        acc[strategy.id] = {
          user_shares: Number(strategy.userShares.find(([principal]) => 
            principal.toString() === user.toString()
          )?.[1] || 0n),
          total_shares: Number(strategy.totalShares),
          initial_deposit: strategy.initialDeposit.find(([principal]) => 
            principal.toString() === user.toString()
          )?.[1] || 0n
        };
        return acc;
      }, {} as Record<string, { user_shares: number; total_shares: number; initial_deposit: bigint }>);
      
      return { strategies, balances };
    } catch (e) {
      console.error(e);
    }
  }
);

// Обновляем только баланс пользователя в конкретной стратегии
export const refreshUserBalance = createAsyncThunk(
  "strategies/refreshUserBalance",
  async ({ user, strategyId }: { user: Principal; strategyId: number }) => {
    try {
      // Получаем обновленные данные только для конкретной стратегии
      const userStrategies = await strategiesService.getUserStrategies(user);
      const strategy = userStrategies.find(s => s.id === strategyId);
      
      if (strategy) {
        const balance = {
          user_shares: Number(strategy.userShares.find(([principal]) => 
            principal.toString() === user.toString()
          )?.[1] || 0n),
          total_shares: Number(strategy.totalShares),
          initial_deposit: strategy.initialDeposit.find(([principal]) => 
            principal.toString() === user.toString()
          )?.[1] || 0n
        };
        
        return { strategyId, balance };
      }
      
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
);

// Обновляем только события для конкретной стратегии
export const refreshStrategyEvents = createAsyncThunk(
  "strategies/refreshEvents",
  async (strategyId: number) => {
    try {
      // Здесь можно добавить логику для обновления событий стратегии
      // Пока возвращаем пустой объект, так как события обновляются отдельно
      return { strategyId, events: [] };
    } catch (e) {
      console.error(e);
      return null;
    }
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initStrategies = createAsyncThunk(
  "strategies/init",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (agent?: Agent) => {
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
      data?: Array<Strategy>;
      status: Status;
      error?: string;
    };
    userStrategies: {
      data?: Array<Strategy>;
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
          initial_deposit: bigint;
          // price: string;
          // usd_balance: number;
          // amount_0: number;
          // amount_1: number;
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
        state.balances.status = Status.SUCCEEDED;
        state.balances.data = action.payload;
      })
      .addCase(fetchStrategiesBalances.rejected, (state, action) => {
        state.balances.status = Status.FAILED;
        state.balances.error = action.error.message;
      })
      .addCase(refreshDataAfterOperation.pending, (state) => {
        state.strategies.status = Status.LOADING;
        state.balances.status = Status.LOADING;
      })
      .addCase(refreshDataAfterOperation.fulfilled, (state, action) => {
        if (action.payload) {
          state.strategies.status = Status.SUCCEEDED;
          state.strategies.data = action.payload.strategies;
          state.balances.status = Status.SUCCEEDED;
          state.balances.data = action.payload.balances;
        }
      })
      .addCase(refreshDataAfterOperation.rejected, (state, action) => {
        state.strategies.status = Status.FAILED;
        state.strategies.error = action.error.message;
        state.balances.status = Status.FAILED;
        state.balances.error = action.error.message;
      })
      .addCase(refreshUserBalance.pending, (state) => {
        // Не меняем общий статус, только локально обновляем баланс
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      })
      .addCase(refreshUserBalance.fulfilled, (state, action) => {
        if (action.payload && state.balances.data) {
          // Обновляем только конкретный баланс стратегии
          state.balances.data[action.payload.strategyId] = action.payload.balance;
          // Устанавливаем статус балансов в SUCCEEDED
          state.balances.status = Status.SUCCEEDED;
        }
      })
      .addCase(refreshUserBalance.rejected, (state, action) => {
        // Логируем ошибку, но не меняем общий статус
        console.error("Failed to refresh user balance:", action.error.message);
      })
      .addCase(refreshStrategyEvents.pending, (state) => {
        // Не меняем общий статус
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      })
      .addCase(refreshStrategyEvents.fulfilled, (state, action) => {
        // Здесь можно обновить события стратегии
        // Пока ничего не делаем, так как события обновляются отдельно
        // Устанавливаем статус в SUCCEEDED чтобы убрать loading
        state.balances.status = Status.SUCCEEDED;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      })
      .addCase(refreshStrategyEvents.rejected, (state, action) => {
        // Логируем ошибку, но не меняем общий статус
        console.error("Failed to refresh strategy events:", action.error.message);
      });
  },
});

export const strategiesReducer = strategiesSlice.reducer;
