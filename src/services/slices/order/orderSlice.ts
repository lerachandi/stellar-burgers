import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';
import { logoutThunk } from '../user/userSlice';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrderThunk = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, thunkApi) => {
  try {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  } catch (err: unknown) {
    const message = (err as { message?: string })?.message;

    if (message === 'jwt expired') {
      await thunkApi.dispatch(logoutThunk());
      return thunkApi.rejectWithValue('Сессия истекла. Войдите заново.');
    }

    return thunkApi.rejectWithValue(message || 'Ошибка оформления заказа');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getOrderError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
        state.orderModalData = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка оформления заказа';
      });
  }
});

export const { resetOrder } = orderSlice.actions;

export const { getOrderRequest, getOrderModalData, getOrderError } =
  orderSlice.selectors;

export default orderSlice.reducer;
