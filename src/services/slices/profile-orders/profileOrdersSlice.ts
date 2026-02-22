import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrdersThunk = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  async () => {
    // getOrdersApi уже возвращает массив orders
    const orders = await getOrdersApi();
    return orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  selectors: {
    getProfileOrders: (state) => state.orders,
    getIsProfileOrdersLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов профиля';
      });
  }
});

export const { getProfileOrders, getIsProfileOrdersLoading } =
  profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
