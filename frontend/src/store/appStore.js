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

    //if the dates are sent, data that are not serializable.
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure serializable check for better performance
      serializableCheck: {
        // Ignore specific action types that may contain non-serializable data
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default appStore;