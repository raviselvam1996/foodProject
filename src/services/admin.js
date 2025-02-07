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

  }),
});

export const { useShopSettingsQuery, usePolicyUpdateMutation,useInfoUpdateMutation } =
adminApi;
