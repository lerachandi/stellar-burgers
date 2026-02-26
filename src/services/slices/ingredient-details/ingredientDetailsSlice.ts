import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientDetailsState = {
  current: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  current: null
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredientDetails: (state, action: PayloadAction<TIngredient>) => {
      state.current = action.payload;
    },
    clearIngredientDetails: (state) => {
      state.current = null;
    }
  },
  selectors: {
    getCurrentIngredient: (state) => state.current
  }
});

export const { setIngredientDetails, clearIngredientDetails } =
  ingredientDetailsSlice.actions;

export const { getCurrentIngredient } = ingredientDetailsSlice.selectors;

export default ingredientDetailsSlice.reducer;
