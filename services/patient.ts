import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api";
import {
  AIReport,
  CreateAIReportRequest,
  CreatePatientProfileRequest,
} from "@/types/patient";

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createProfile: builder.mutation<any, CreatePatientProfileRequest>({
      query: (profileData) => ({
        url: "patient/onboard",
        method: "POST",
        body: profileData,
      }),
    }),
    generateAIReport: builder.mutation<AIReport, CreateAIReportRequest>({
      query: ({ description, images }) => {
        const formData = new FormData();
        formData.append("description", description);
        images.forEach((image) => {
          formData.append("images", image);
        });
        return {
          url: "patient/onboard-report",
          method: "POST",
          body: formData,
        };
      },
    }),
    getMyReports: builder.query<AIReport[], void>({
      query: () => "patient/reports",
    }),
    getProfile: builder.query<any, void>({
      query: () => "patient/profile/me",
    }),
    updateProfile: builder.mutation<any, any>({
      query: (dto) => ({
        url: "patient/profile/me",
        method: "PATCH",
        body: dto,
      }),
    }),
  }),
});

export const {
  useCreateProfileMutation,
  useGenerateAIReportMutation,
  useGetMyReportsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = patientApi;
