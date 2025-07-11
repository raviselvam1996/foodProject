import { createApi } from '@reduxjs/toolkit/query/react';

import BaseQueryInstance from '../rtk-base-setings/baseQuery';

// import { getCookie } from 'cookies-next'

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: BaseQueryInstance,
  endpoints: (builder) => ({
    orderList: builder.mutation({
      query: () => ({
        url: 'admin/order',
        method: 'GET',
      }),
    }),
    orderChange: builder.mutation({
      query: (data) => ({
        url: 'admin/order/change_status',
        method: 'POST',
        body: data,
      }),
    }),
    getAnalytics: builder.mutation({
      query: (data) => ({
        url: 'admin/analytics',
        method: 'GET',
        body: data,
      }),
    }),
    getOrderHistory: builder.mutation({
      query: (data) => ({
        url: 'admin/order_history',
        method: 'GET',
        body: data,
      }),
    }),
    getFaildOrders: builder.mutation({
      query: (data) => ({
        url: 'admin/order/pending_payments',
        method: 'GET',
        body: data,
      }),
    }),



  }),
});

export const { useOrderListMutation, useOrderChangeMutation,useGetAnalyticsMutation,useGetOrderHistoryMutation,useGetFaildOrdersMutation} =
  orderApi;
