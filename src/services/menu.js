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
    editMenu: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/update',
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
        url: 'admin/menu/menu_item/add',
        method: 'POST',
        body: data,
      }),
    }),
    itemEdit: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/menu_item/update',
        method: 'POST',
        body: data,
      }),
    }),
    delMenuItem: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/menu_item/del',
        method: 'POST',
        body: data,
      }),
    }),
    menuItemStatusChange: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/menu_item/change_status',
        method: 'POST',
        body: data,
      }),
    }),
    addonCreate: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/add_on/add',
        method: 'POST',
        body: data,
      }),
    }),
    addonUpdate: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/add_on/update',
        method: 'POST',
        body: data,
      }),
    }),
    delAddOn: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/add_on/del',
        method: 'POST',
        body: data,
      }),
    }),
    addonItemCreate: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/add_on/add_item',
        method: 'POST',
        body: data,
      }),
    }),
    getAddonItems: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/add_on/get_items',
        method: 'POST',
        body: data,
      }),
    }),
    delAddOnItem: builder.mutation({
      query: (data) => ({
        url: 'admin/menu/add_on/del_item',
        method: 'POST',
        body: data,
      }),
    }),
    imageUpload: builder.mutation({
      query: (data) => ({
        url: 'admin/img_upload',
        method: 'POST',
        body: data,
      }),
    }),
    getAddonItemsSuggest: builder.mutation({
      query: () => ({
        url: 'admin/menu/add_on/suggest',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetSupplierCategoryQuery, useMenuStatusChangeMutation, useAddMenuMutation,useDelMenuMutation,useGetMenuItemsMutation,useItemCreateMutation,useAddonCreateMutation,useAddonItemCreateMutation,useEditMenuMutation,useItemEditMutation,useDelMenuItemMutation,useAddonUpdateMutation,useDelAddOnMutation,useGetAddonItemsMutation,useMenuItemStatusChangeMutation,useImageUploadMutation,useDelAddOnItemMutation ,useGetAddonItemsSuggestMutation} =
  menuProductApi;
