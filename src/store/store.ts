import { configureStore } from "@reduxjs/toolkit";
import { stacksApi } from "./stacksApi";

export const store = configureStore({
  reducer: {
    [stacksApi.reducerPath]: stacksApi.reducer,
  },
  middleware: (getDefaultMiddlaware) => getDefaultMiddlaware().concat(stacksApi.middleware),
});
