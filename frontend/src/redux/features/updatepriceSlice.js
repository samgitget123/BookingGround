import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define the updateprice async thunk
export const updateprice = createAsyncThunk(
  "updateprice/updatedata",
  async ({ booking_id, newAmount, combopack }) => {
    try {
      const response = await fetch("http://localhost:5000/api/booking/updateprice", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id,
          newAmount,
          combopack,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the price");
      }

      const data = await response.json();
      console.log(data, 'updateprice');
      return data; // Return the fetched data
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Initial state for the slice
const initialState = {
  updateStatus: {},
  loading: false,
  error: null,
};

// Create slice
const updatePriceSlice = createSlice({
  name: "updatePrice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateprice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateprice.fulfilled, (state, action) => {
        state.loading = false;
        state.updateStatus = action.payload;
      })
      .addCase(updateprice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export reducer
export default updatePriceSlice.reducer;
