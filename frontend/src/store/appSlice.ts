import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from '../api/client';

export const fetchAbout = createAsyncThunk('app/fetchAbout', async () => {
  const { data } = await apiClient.get<{ message: string }>('/about');
  return data.message;
});

interface AppState {
  message: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppState = {
  message: null,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export default appSlice.reducer;
