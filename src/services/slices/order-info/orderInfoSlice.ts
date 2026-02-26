import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null
};

export const fetchOrderByNumberThunk = createAsyncThunk(
  'orderInfo/fetchByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0] ?? null;
  }
);

const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  selectors: {
    getOrderInfo: (state) => state.order,
    getIsOrderInfoLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderInfo } = orderInfoSlice.actions;
export const { getOrderInfo, getIsOrderInfoLoading } = orderInfoSlice.selectors;

export default orderInfoSlice.reducer;
