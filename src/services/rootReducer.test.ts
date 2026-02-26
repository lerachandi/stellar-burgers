import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('начальное состояние стора', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      burgerIngredients: {
        items: [],
        isLoading: false,
        isLoaded: false,
        error: null
      },
      ingredientDetails: {
        current: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      user: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      orderInfo: {
        order: null,
        isLoading: false,
        error: null
      }
    });
  });
});
