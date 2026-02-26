import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  const bun: TIngredient = {
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

  const mainIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  it('добавление булки в конструктор', () => {
    const state = reducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('добавление ингредиента в список', () => {
    const state = reducer(undefined, addIngredient(mainIngredient));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mainIngredient);
  });

  it('удаление ингредиента по id', () => {
    const state = reducer(undefined, addIngredient(mainIngredient));
    const idToRemove = state.ingredients[0].id;

    const updatedState = reducer(state, removeIngredient(idToRemove));

    expect(updatedState.ingredients).toHaveLength(0);
  });

  it('перемещение ингредиентов', () => {
    let state = reducer(undefined, addIngredient(mainIngredient));
    state = reducer(state, addIngredient(mainIngredient));

    const firstId = state.ingredients[0].id;
    const secondId = state.ingredients[1].id;

    const movedState = reducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(movedState.ingredients[0].id).toBe(secondId);
    expect(movedState.ingredients[1].id).toBe(firstId);
  });
  it('перемещает начинку вниз', () => {
    let state = reducer(undefined, addIngredient(mainIngredient));
    state = reducer(state, addIngredient(mainIngredient));

    const firstId = state.ingredients[0].id;
    const secondId = state.ingredients[1].id;

    const movedState = reducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(movedState.ingredients[0].id).toBe(secondId);
    expect(movedState.ingredients[1].id).toBe(firstId);
  });

  it('перемещает начинку вверх', () => {
    let state = reducer(undefined, addIngredient(mainIngredient));
    state = reducer(state, addIngredient(mainIngredient));

    const firstId = state.ingredients[0].id;
    const secondId = state.ingredients[1].id;

    const movedState = reducer(
      state,
      moveIngredient({ fromIndex: 1, toIndex: 0 })
    );

    expect(movedState.ingredients[0].id).toBe(secondId);
    expect(movedState.ingredients[1].id).toBe(firstId);
  });

  it('не перемещает первый ингредиент вверх (граничный случай)', () => {
    let state = reducer(undefined, addIngredient(mainIngredient));
    state = reducer(state, addIngredient(mainIngredient));

    const beforeIds = state.ingredients.map((item) => item.id);

    const movedState = reducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: -1 })
    );

    const afterIds = movedState.ingredients.map((item) => item.id);
    expect(afterIds).toEqual(beforeIds);
  });

  it('не перемещает последний ингредиент вниз (граничный случай)', () => {
    let state = reducer(undefined, addIngredient(mainIngredient));
    state = reducer(state, addIngredient(mainIngredient));

    const lastIndex = state.ingredients.length - 1;
    const beforeIds = state.ingredients.map((item) => item.id);

    const movedState = reducer(
      state,
      moveIngredient({ fromIndex: lastIndex, toIndex: lastIndex + 1 })
    );

    const afterIds = movedState.ingredients.map((item) => item.id);
    expect(afterIds).toEqual(beforeIds);
  });

  it('очищеие конструктора', () => {
    let state = reducer(undefined, addIngredient(bun));
    state = reducer(state, addIngredient(mainIngredient));

    const clearedState = reducer(state, clearConstructor());

    expect(clearedState.bun).toBeNull();
    expect(clearedState.ingredients).toHaveLength(0);
  });
});
