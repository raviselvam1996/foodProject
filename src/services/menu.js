import { createApi } from '@reduxjs/toolkit/query/react';

import BaseQueryInstance from '../rtk-base-setings/baseQuery';

// import { getCookie } from 'cookies-next'

export const menuProductApi = createApi({
  reducerPath: 'menuProductApi',
  baseQuery: BaseQueryInstance,
  endpoints: (builder) => ({
    getSupplierCategory: builder.query({
      query: () => ({
        url: 'admin/menu',
        method: 'GET',
      }),
    }),
    menuStatusChange: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/change_status',
        method: 'POST',
        body: data,
      }),
    }),
    addMenu: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/add',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetSupplierCategoryQuery, useMenuStatusChangeMutation, useAddMenuMutation } =
  menuProductApi;
