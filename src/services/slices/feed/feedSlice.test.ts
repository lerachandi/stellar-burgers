import reducer, { fetchFeedsThunk } from './feedSlice';

describe('feedSlice', () => {
  it('начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null
    });
  });

  it('pending: начинает загрузку и сбрасывает ошибку', () => {
    const state = reducer(undefined, { type: fetchFeedsThunk.pending.type });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет полученные заказы', () => {
    const payload = {
      success: true,
      orders: [
        {
          _id: '69a08dd2a64177001b32db66',
          status: 'done',
          name: 'Space флюоресцентный бургер',
          createdAt: '2026-02-26T18:15:46.988Z',
          updatedAt: '2026-02-26T18:15:47.239Z',
          number: 101912,
          ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
        }
      ],
      total: 500,
      totalToday: 10
    };

    const state = reducer(undefined, {
      type: fetchFeedsThunk.fulfilled.type,
      payload
    });

    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(500);
    expect(state.totalToday).toBe(10);
  });

  it('rejected: сохраняет ошибку', () => {
    const state = reducer(undefined, {
      type: fetchFeedsThunk.rejected.type,
      error: { message: 'Ошибка' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
