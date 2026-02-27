import reducer, {
  setIngredientDetails,
  clearIngredientDetails
} from './ingredientDetailsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientDetailsSlice', () => {
  const ingredient: TIngredient = {
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
  };

  it('начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({ current: null });
  });

  it('сохраняет выбранный ингредиент', () => {
    const state = reducer(undefined, setIngredientDetails(ingredient));
    expect(state.current).toEqual(ingredient);
  });

  it('очищает выбранный ингредиент', () => {
    const filled = reducer(undefined, setIngredientDetails(ingredient));
    const cleared = reducer(filled, clearIngredientDetails());
    expect(cleared.current).toBeNull();
  });
});
