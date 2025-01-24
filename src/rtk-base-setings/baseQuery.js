import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BaseQueryInstance = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/',
  // baseUrl: `${process.env.NEXT_PUBLIC_WEB_HOST}`,
  prepareHeaders: (headers, { getState }) => {
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqYm9faWQiOjIzMywidXNlcl9pZCI6MTExLCJvdHBfdmVyaWZpY2F0aW9uIjoxLCJreWNfdmVyaWZpY2F0aW9uIjoxLCJpYXQiOjE3MTYwMjQxMjF9.vn-dHXSzuKw7I9nt7TCGm9K0vSXu1CbvTTyI7YFNsEY";

    // headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers.set('Accept', '*/*')

    return headers
  }
})

export default BaseQueryInstance
