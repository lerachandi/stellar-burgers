import reducer, { fetchBurgerIngredients } from './burgerIngredientsSlice';
import { TIngredient } from '@utils-types';

describe('burgerIngredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    }
  ];

  it('pending: ставит isLoading=true и сбрасывает error', () => {
    const action = { type: fetchBurgerIngredients.pending.type };
    const state = reducer(undefined, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: сохраняет полученные данные', () => {
    const action = {
      type: fetchBurgerIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoaded).toBe(true);
  });

  it('rejected: ставит isLoading=false и записывает error', () => {
    const action = {
      type: fetchBurgerIngredients.rejected.type,
      error: { message: 'Ошибка' }
    };

    const state = reducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
