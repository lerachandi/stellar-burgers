import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';
import { TIngredient } from '@utils-types';
import { RootState } from '../../store';

export const fetchBurgerIngredients = createAsyncThunk(
  'burgerIngredients/fetchBurgerIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const { isLoading, isLoaded } = state.burgerIngredients;

      if (isLoading || isLoaded) return false;
      return true;
    }
  }
);

type TBurgerIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
};

const initialState: TBurgerIngredientsState = {
  items: [],
  isLoading: false,
  isLoaded: false,
  error: null
};

const burgerIngredientsSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.items,
    getIsIngredientsLoading: (state) => state.isLoading,
    getIsIngredientsLoaded: (state) => state.isLoaded
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBurgerIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBurgerIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.isLoaded = true;
      })
      .addCase(fetchBurgerIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const {
  getIngredients,
  getIsIngredientsLoading,
  getIsIngredientsLoaded
} = burgerIngredientsSlice.selectors;

export default burgerIngredientsSlice.reducer;
