import { configureStore } from "@reduxjs/toolkit";

import { articleApi } from "./article";

// store
export const store = configureStore({
  // reducer
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer,
  },
  // middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(articleApi.middleware),
});
