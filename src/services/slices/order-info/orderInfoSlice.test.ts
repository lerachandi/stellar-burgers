import reducer, {
  clearOrderInfo,
  fetchOrderByNumberThunk
} from './orderInfoSlice';

describe('orderInfoSlice', () => {
  const order = {
    _id: '69a08dd2a64177001b32db66',
    status: 'done',
    name: 'Space флюоресцентный люминесцентный бургер',
    createdAt: '2026-02-26T18:15:46.988Z',
    updatedAt: '2026-02-26T18:15:47.239Z',
    number: 101912,
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa0943',
      '643d69a5c3f7b9001cfa093d'
    ]
  };

  it('начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });

  it('clearOrderInfo: очищает данные заказа', () => {
    const filled = reducer(undefined, {
      type: fetchOrderByNumberThunk.fulfilled.type,
      payload: order
    });

    const state = reducer(filled, clearOrderInfo());

    expect(state).toEqual({
      order: null,
      isLoading: false,
      error: null
    });
  });

  it('pending: начинает загрузку и сбрасывает ошибку', () => {
    const state = reducer(undefined, {
      type: fetchOrderByNumberThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: сохраняет заказ и завершает загрузку', () => {
    const state = reducer(undefined, {
      type: fetchOrderByNumberThunk.fulfilled.type,
      payload: order
    });

    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(order);
  });

  it('rejected: завершает загрузку и сохраняет ошибку', () => {
    const state = reducer(undefined, {
      type: fetchOrderByNumberThunk.rejected.type,
      error: { message: 'Ошибка' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
