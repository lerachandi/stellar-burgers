import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

type TFeedsResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// ВАЖНО: без condition и без аргументов
export const fetchFeedsThunk = createAsyncThunk<TFeedsResponse>(
  'feed/fetchFeeds',
  async () => (await getFeedsApi()) as TFeedsResponse
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedOrders: (state) => state.orders,
    getFeedTotal: (state) => state.total,
    getFeedTotalToday: (state) => state.totalToday,
    getIsFeedLoading: (state) => state.isLoading,
    getFeedError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      });
  }
});

export const {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday,
  getIsFeedLoading,
  getFeedError
} = feedSlice.selectors;

// Если тебе удобнее доставать "объектом"
const selectFeedSlice = (state: RootState) => state.feed;

export const getFeedInfo = createSelector([selectFeedSlice], (feed) => ({
  total: feed.total,
  totalToday: feed.totalToday
}));

export const getReadyOrdersNumbers = createSelector([selectFeedSlice], (feed) =>
  feed.orders
    .filter((o) => o.status === 'done')
    .map((o) => o.number)
    .slice(0, 20)
);

export const getPendingOrdersNumbers = createSelector(
  [selectFeedSlice],
  (feed) =>
    feed.orders
      .filter((o) => o.status === 'pending' || o.status === 'created')
      .map((o) => o.number)
      .slice(0, 20)
);

export default feedSlice.reducer;
