import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/lib/api";
import { Appointment, BookAppointmentRequest } from "@/types/appointment";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Appointment"],
  endpoints: (builder) => ({
    bookAppointment: builder.mutation<Appointment, BookAppointmentRequest>({
      query: (dto) => ({
        url: "appointment/book",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Appointment"],
    }),
    cancelAppointment: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `appointment/cancel/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Appointment"],
    }),
    completeAppointment: builder.mutation<any, number>({
      query: (id) => ({
        url: `appointment/complete/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Appointment"],
    }),
    getMyAppointments: builder.query<Appointment[], void>({
      query: () => "appointment/my",
      providesTags: ["Appointment"],
    }),
    getDoctorAppointments: builder.query<Appointment[], void>({
      query: () => "appointment/doctor",
      providesTags: ["Appointment"],
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
  useGetMyAppointmentsQuery,
  useGetDoctorAppointmentsQuery,
} = appointmentApi;
