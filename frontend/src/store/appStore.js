import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import videoReducer from './videoSlice'

/**
 * Central Redux store instance.
 * All domain-specific reducers are registered here.
 * Middleware and devtools are configured at the store level.
 */
export const appStore = configureStore({
    reducer: {
      auth: authReducer, // Authentication state management
      videos: videoReducer,
    },
})

export default appStore;