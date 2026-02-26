import { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/burger-ingredients/burgerIngredientsSlice';

import { OrderCardUI } from '../ui/order-card';
import { TOrder, TIngredient } from '@utils-types';

type OrderCardProps = {
  order: TOrder;
};

const MAX_INGREDIENTS = 6;

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const location = useLocation();
  const ingredients = useSelector(getIngredients);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    const ingredientsInfo = order.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter((x): x is TIngredient => Boolean(x));

    const total = ingredientsInfo.reduce((sum, item) => sum + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, MAX_INGREDIENTS);
    const remains = Math.max(ingredientsInfo.length - MAX_INGREDIENTS, 0);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
};
