import { configureStore } from '@reduxjs/toolkit'


/**
 * Central Redux store instance.
 * All domain-specific reducers are registered here.
 * Middleware and devtools are configured at the store level.
 */
export const appStore = configureStore({
    reducer: {

    },

    //dispatching non-serializable data (Dates, Files, class instances)
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