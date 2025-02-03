import { createApi } from '@reduxjs/toolkit/query/react';

import BaseQueryInstance from '../rtk-base-setings/baseQuery';

// import { getCookie } from 'cookies-next'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: BaseQueryInstance,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: 'admin/login',
        method: 'POST',
        body: data,
      }),
    }),
    signIn: builder.mutation({
      query: (data) => ({
        url: 'admin/super_admin/add',
        method: 'POST',
        body: data,
      }),
    }),

  }),
});

export const {  useLoginMutation,useSignInMutation } =
  authApi;
