import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const pathname = window.location.pathname;

    // Handle 401 Unauthorized
    if (result.error.status === 401) {
      let redirectPath = "/login";
      if (pathname.includes("/doctor")) {
        redirectPath = "/doctor/login";
      } else if (pathname.includes("/patient")) {
        redirectPath = "/patient/login";
      }
      localStorage.removeItem("accessToken");
      window.location.href = redirectPath;
    }

    // Handle 403 Forbidden (Not Onboarded)
    if (result.error.status === 403 && !pathname.includes("/login")) {
      let redirectPath = "/login";
      if (pathname.includes("/doctor")) {
        redirectPath = "/doctor/onboard";
      } else if (pathname.includes("/patient")) {
        redirectPath = "/patient/onboard";
      }
      window.location.href = redirectPath;
    }
  }

  return result;
};
