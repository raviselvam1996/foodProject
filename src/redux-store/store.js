// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports

import { menuProductApi } from '../services/menu'


export const store = configureStore({
  reducer: {
  
    [menuProductApi.reducerPath]: menuProductApi.reducer,

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false })

      .concat(menuProductApi.middleware)

})
