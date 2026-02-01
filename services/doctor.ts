import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api";
import {
  CreateTimeSlotRequest,
  Doctor,
  FindDoctorQueryDto,
  OnBoardingDoctorRequest,
  TimeSlot,
} from "@/types/doctor";

export const doctorApi = createApi({
  reducerPath: "doctorApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDoctorById: builder.query<Doctor, number>({
      query: (id) => `doctor/${id}`,
    }),
    getAllDoctors: builder.query<Doctor[], FindDoctorQueryDto | void>({
      query: (query) => ({
        url: "doctor",
        params: query || {},
      }),
    }),
    getAllPendingDoctors: builder.query<Doctor[], FindDoctorQueryDto | void>({
      query: (query) => ({
        url: "doctor/pending",
        params: query || {},
      }),
    }),
    verifyDoctor: builder.mutation<any, number>({
      query: (id) => ({
        url: `doctor/${id}/verify`,
        method: "POST",
      }),
    }),
    onboard: builder.mutation<any, OnBoardingDoctorRequest>({
      query: (onboardData) => {
        const formData = new FormData();
        formData.append("licenseNumber", onboardData.licenseNumber);
        formData.append(
          "experienceYears",
          onboardData.experienceYears.toString(),
        );
        formData.append(
          "consultationFee",
          onboardData.consultationFee.toString(),
        );
        if (onboardData.bio) formData.append("bio", onboardData.bio);
        if (onboardData.clinicAddress)
          formData.append("clinicAddress", onboardData.clinicAddress);
        formData.append("timeSlots", JSON.stringify(onboardData.timeSlots));
        formData.append("degree", onboardData.degree);
        if (onboardData.certificate)
          formData.append("certificate", onboardData.certificate);

        return {
          url: "doctor/onboard",
          method: "POST",
          body: formData,
        };
      },
    }),
    addTimeSlots: builder.mutation<any, CreateTimeSlotRequest>({
      query: (slotsData) => ({
        url: "doctor/slots",
        method: "POST",
        body: slotsData,
      }),
    }),
    getDoctorTimeSlots: builder.query<TimeSlot[], void>({
      query: () => `doctor/slots`,
    }),
    getProfile: builder.query<Doctor, void>({
      query: () => "doctor/profile/me",
    }),
    updateProfile: builder.mutation<Doctor, any>({
      query: (dto) => ({
        url: "doctor/profile/me",
        method: "PATCH",
        body: dto,
      }),
    }),
    deleteTimeSlot: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `doctor/slots/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDoctorByIdQuery,
  useGetAllDoctorsQuery,
  useGetAllPendingDoctorsQuery,
  useVerifyDoctorMutation,
  useOnboardMutation,
  useAddTimeSlotsMutation,
  useGetDoctorTimeSlotsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteTimeSlotMutation,
} = doctorApi;
