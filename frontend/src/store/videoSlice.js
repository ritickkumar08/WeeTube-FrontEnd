import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async () => {
    const res = await axiosInstance.get("/video");
    return res.data;
  }
);

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch videos";
      });
  },
});

export default videoSlice.reducer;
