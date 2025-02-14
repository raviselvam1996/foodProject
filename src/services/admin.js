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
      getPermission: builder.mutation({
        query: () => ({
          url: 'admin/employee/permissions',
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


  }),
});

export const { useShopSettingsQuery, usePolicyUpdateMutation,useInfoUpdateMutation,useTimingUpdateMutation,useGetEmployeeMutation,useAddEmployeeMutation,useEditEmployeeMutation,useDelEmployeeMutation,useGetPermissionMutation } =
adminApi;
