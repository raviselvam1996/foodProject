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
    delMenu: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/del',
        method: 'POST',
        body: data,
      }),
    }),
    // For menu items
    getMenuItems: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/menu_item',
        method: 'POST',
        body: data,
      }),
    }),
    itemCreate: builder.mutation({
      query: (data) => ({
        url: 'admin/menu_item/add',
        method: 'POST',
        body: data,
      }),
    }),
    addonCreate: builder.mutation({
      query: (data) => ({
        url: 'admin/add_on/add',
        method: 'POST',
        body: data,
      }),
    }),
    addonItemCreate: builder.mutation({
      query: (data) => ({
        url: 'admin/add_on/add_item',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetSupplierCategoryQuery, useMenuStatusChangeMutation, useAddMenuMutation,useDelMenuMutation,useGetMenuItemsMutation,useItemCreateMutation,useAddonCreateMutation,useAddonItemCreateMutation } =
  menuProductApi;
