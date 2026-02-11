import { createSlice } from '@reduxjs/toolkit';

/**
 * Owns identity, session token, and auth lifecycle flags.
 */
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Hydrates auth state after successful login or session validation.
    setAuth: (state, action) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.loading = false;

      if (token) {
        localStorage.setItem('token', token);
      }
    },

    // Clears all authentication-related state.
    // Used on logout or forced session invalidation.
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;

      localStorage.removeItem('token');
    },

    // Applies partial updates to the authenticated user object.
    updateUser: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },

    // Toggles auth-related loading states.
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuth, clearAuth, updateUser, setAuthLoading } =
  authSlice.actions;

export default authSlice.reducer;
