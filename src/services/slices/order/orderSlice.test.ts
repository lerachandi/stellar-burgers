import reducer, { resetOrder, createOrderThunk } from './orderSlice';

describe('orderSlice', () => {
  it('начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      orderRequest: false,
      orderModalData: null,
      error: null
    });
  });

  it('сбрасывает состояние заказа', () => {
    const filledState = reducer(undefined, {
      type: createOrderThunk.fulfilled.type,
      payload: {
        _id: '1',
        status: 'done',
        name: 'Space бургер',
        createdAt: '2026-02-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
        number: 101912,
        ingredients: ['a', 'b']
      }
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

  it('fulfilled: сохраняет заказ и выключает запрос', () => {
    const payload = {
      _id: '1',
      status: 'done',
      name: 'Заказ',
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
      number: 123,
      ingredients: ['a']
    };

    const state = reducer(undefined, {
      type: createOrderThunk.fulfilled.type,
      payload
    });

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(payload);
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
