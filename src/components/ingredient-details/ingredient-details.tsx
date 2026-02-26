import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useDispatch, useSelector } from '../../services/store';
import {
  getCurrentIngredient,
  setIngredientDetails,
  clearIngredientDetails
} from '../../services/slices/ingredient-details/ingredientDetailsSlice';
import { getIngredients } from '../../services/slices/burger-ingredients/burgerIngredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();
  const ingredientData = useSelector(getCurrentIngredient);
  const ingredients = useSelector(getIngredients);

  useEffect(() => {
    if (!id) return;

    const found = ingredients.find((item) => item._id === id);
    if (found) {
      dispatch(setIngredientDetails(found));
    }
  }, [id, ingredients, dispatch]);

  useEffect(
    () => () => {
      dispatch(clearIngredientDetails());
    },
    [dispatch]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
