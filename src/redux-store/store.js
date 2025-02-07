// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports

import { menuProductApi } from '../services/menu'
import { authApi } from '../services/auth'
import { adminApi } from '../services/admin'


export const store = configureStore({  
  reducer: {
  
    [menuProductApi.reducerPath]: menuProductApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false })

      .concat(menuProductApi.middleware)
      .concat(authApi.middleware)
      .concat(adminApi.middleware)

})
