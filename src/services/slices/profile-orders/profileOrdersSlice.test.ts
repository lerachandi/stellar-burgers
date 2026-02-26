import reducer, { fetchProfileOrdersThunk } from './profileOrdersSlice';

describe('profileOrdersSlice', () => {
  it('начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      orders: [],
      isLoading: false,
      error: null
    });
  });

  it('pending: начинает загрузку и сбрасывает ошибку', () => {
    const state = reducer(undefined, {
      type: fetchProfileOrdersThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: сохраняет заказы и выключает загрузку', () => {
    const payload = [
      {
        _id: '1',
        status: 'done',
        name: 'Заказ',
        createdAt: '2026-02-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
        number: 123,
        ingredients: ['a']
      }
    ];

    const state = reducer(undefined, {
      type: fetchProfileOrdersThunk.fulfilled.type,
      payload
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload);
  });

  it('rejected: завершает загрузку и сохраняет ошибку', () => {
    const state = reducer(undefined, {
      type: fetchProfileOrdersThunk.rejected.type,
      error: { message: 'Ошибка' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
