import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<any, RegisterRequest>({
      query: (credentials) => ({
        url: "users/register",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmail: builder.query<any, string>({
      query: (token) => `users/verify?token=${token}`,
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "users/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.token);
        } catch (err) {
          // Handle error if needed
        }
      },
    }),
    getProfile: builder.query<User, void>({
      query: () => "users/profile",
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailQuery,
  useLoginMutation,
  useGetProfileQuery,
  useGetUserByIdQuery,
} = authApi;
