import reducer, { resetOrder, createOrderThunk } from './orderSlice';

describe('orderSlice', () => {
  const order = {
    _id: '69a08dd2a64177001b32db66',
    status: 'done',
    name: 'Space флюоресцентный бургер',
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
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  it('resetOrder: сбрасывает состояние заказа', () => {
    const filledState = reducer(undefined, {
      type: createOrderThunk.fulfilled.type,
      payload: order
    });

    const state = reducer(filledState, resetOrder());

    expect(state).toEqual({
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  it('pending: начинает запрос и очищает ошибку и данные', () => {
    const state = reducer(undefined, { type: createOrderThunk.pending.type });

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orderModalData).toBeNull();
  });

  it('fulfilled: сохраняет заказ и завершает запрос', () => {
    const state = reducer(undefined, {
      type: createOrderThunk.fulfilled.type,
      payload: order
    });

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
  });

  it('rejected: завершает запрос и сохраняет ошибку', () => {
    const state = reducer(undefined, {
      type: createOrderThunk.rejected.type,
      payload: 'Ошибка оформления заказа',
      error: { message: 'ignored' }
    });

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка оформления заказа');
  });
});
