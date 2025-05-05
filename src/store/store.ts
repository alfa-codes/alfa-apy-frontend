import { configureStore } from "@reduxjs/toolkit";
import {
  tokensReducer,
  balancesReducer,
  balanceReducer,
  strategiesReducer,
  strategyReducer,
  swapReducer,
} from "./slices";

export const store = configureStore({
  reducer: {
    tokens: tokensReducer,
    balances: balancesReducer,
    balance: balanceReducer,
    strategies: strategiesReducer,
    strategy: strategyReducer,
    swap: swapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type Dispatch = typeof store.dispatch;
