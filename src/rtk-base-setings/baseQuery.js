import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BaseQueryInstance = fetchBaseQuery({
  // baseUrl: 'http://localhost:3000/api/',
  // baseUrl: 'http://192.168.26.246:3000/api/',
  baseUrl: `${import.meta.env.VITE_DASHBOARD_BASE_URL}/api/`,
  // baseUrl: `https://api.turkish-kebab-pizza-house.co.uk/api/`,
  prepareHeaders: (headers, { getState }) => {
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqYm9faWQiOjIzMywidXNlcl9pZCI6MTExLCJvdHBfdmVyaWZpY2F0aW9uIjoxLCJreWNfdmVyaWZpY2F0aW9uIjoxLCJpYXQiOjE3MTYwMjQxMjF9.vn-dHXSzuKw7I9nt7TCGm9K0vSXu1CbvTTyI7YFNsEY";

    // headers.set('Content-Type', 'application/x-www-form-urlencoded');
        // Get token from Redux state
      // const accessToken = sessionStorage.getItem('jwt_access_token');
      const accessToken = localStorage.getItem('jwt_access_token');

        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
    headers.set('Accept', '*/*')

    return headers
  }
})

export default BaseQueryInstance
