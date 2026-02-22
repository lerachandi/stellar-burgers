import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TMoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }

      state.ingredients.push({
        ...ingredient,
        id: nanoid()
      });
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { fromIndex, toIndex } = action.payload;

      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }

      const [moved] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moved);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getConstructorBun: (state) => state.bun,
    getConstructorIngredients: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { getConstructorBun, getConstructorIngredients } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
