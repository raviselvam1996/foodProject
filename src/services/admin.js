import { createApi } from '@reduxjs/toolkit/query/react';

import BaseQueryInstance from '../rtk-base-setings/baseQuery';

// import { getCookie } from 'cookies-next'

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: BaseQueryInstance,
  endpoints: (builder) => ({
    shopSettings: builder.query({
      query: () => ({
        url: 'admin/shop/settings',
        method: 'GET',
      }),
    }),
    policyUpdate: builder.mutation({
      query: (data) => ({
        url: 'admin/policies/update',
        method: 'POST',
        body: data,
      }),
    }),
    infoUpdate: builder.mutation({
      query: (data) => ({
        url: 'admin/shop/update',
        method: 'POST',
        body: data,
      }),
    }),
    timingUpdate: builder.mutation({
      query: (data) => ({
        url: 'admin/shopTimings/update',
        method: 'POST',
        body: data,
      }),
    }),

    // For Employee profile
    getEmployee: builder.mutation({
      query: () => ({
        url: 'admin/employee',
        method: 'GET',
      }),
    }),
    addEmployee: builder.mutation({
      query: (data) => ({
        url: 'admin/employee/add',
        method: 'POST',
        body: data,
      }),
    }),
    editEmployee: builder.mutation({
      query: (data) => ({
        url: 'admin/employee/update',
        method: 'POST',
        body: data,
      }),
    }),
    delEmployee: builder.mutation({
      query: (data) => ({
        url: 'admin/employee/del',
        method: 'POST',
        body: data,
      }),
    }),
    employeeStatusChange: builder.mutation({
      query: (data) => ({
        url: 'admin/employee/change_status',
        method: 'POST',
        body: data,
      }),
    }),
    employeeRollChange: builder.mutation({
      query: (data) => ({
        url: 'admin/employee/roleChange',
        method: 'POST',
        body: data,
      }),
    }),

    // For Admin profile
    getAdmin: builder.mutation({
      query: () => ({
        url: 'admin',
        method: 'GET',
      }),
    }),
     // For Admin profile
     getAdmin: builder.mutation({
      query: () => ({
        url: 'admin',
        method: 'GET',
      }),
    }),
    addAdmin: builder.mutation({
      query: (data) => ({
        url: 'admin/add',
        method: 'POST',
        body: data,
      }),
    }),
    editAdmin: builder.mutation({
      query: (data) => ({
        url: 'admin/update',
        method: 'POST',
        body: data,
      }),
    }),
    delAdmin: builder.mutation({
      query: (data) => ({
        url: 'admin/del',
        method: 'POST',
        body: data,
      }),
    }),
    adminRollChange: builder.mutation({
      query: (data) => ({
        url: 'admin/roleChange',
        method: 'POST',
        body: data,
      }),
    }),
   // For Customer profile
   getCustommer: builder.mutation({
    query: () => ({
      url: 'admin/client_list',
      method: 'GET',
    }),
  }),
  getCustomerDetail: builder.mutation({
    query: (data) => ({
      url: 'admin/client/details',
      method: 'POST',
      body: data,
    }),
  }),
  customerStatusChange: builder.mutation({
    query: (data) => ({
      url: 'admin/client/update_status',
      method: 'POST',
      body: data,
    }),
  }),
  holidayInserts: builder.mutation({
    query: (data) => ({
      url: 'admin/holiday/add',
      method: 'POST',
      body: data,
    }),
  }),
  holidayDel: builder.mutation({
    query: (data) => ({
      url: 'admin/holiday/del',
      method: 'POST',
      body: data,
    }),
  }),
  holidayList: builder.mutation({
    query: () => ({
      url: 'admin/holiday/list',
      method: 'GET',
    }),
  }),


  }),
});

export const { useShopSettingsQuery, usePolicyUpdateMutation, useInfoUpdateMutation, useTimingUpdateMutation, useGetEmployeeMutation, useAddEmployeeMutation, useEditEmployeeMutation, useDelEmployeeMutation, useEmployeeStatusChangeMutation,useEmployeeRollChangeMutation,useGetAdminMutation ,useAddAdminMutation, useEditAdminMutation, useDelAdminMutation,useAdminRollChangeMutation,useGetCustommerMutation,useGetCustomerDetailMutation,useCustomerStatusChangeMutation,useHolidayInsertsMutation,useHolidayDelMutation,useHolidayListMutation} =
  adminApi;
