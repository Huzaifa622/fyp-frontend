import { configureStore } from "@reduxjs/toolkit";
// ...

import { authApi } from "./services/auth";
import { patientApi } from "./services/patient";
import { doctorApi } from "./services/doctor";
import { appointmentApi } from "./services/appointment";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      patientApi.middleware,
      doctorApi.middleware,
      appointmentApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
