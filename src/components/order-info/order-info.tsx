import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/burger-ingredients/burgerIngredientsSlice';
import { getFeedOrders } from '../../services/slices/feed/feedSlice';
import { getProfileOrders } from '../../services/slices/profile-orders/profileOrdersSlice';

import {
  fetchOrderByNumberThunk,
  getIsOrderInfoLoading,
  getOrderInfo
} from '../../services/slices/order-info/orderInfoSlice';

export const OrderInfo: FC<{ isModal?: boolean }> = ({ isModal = false }) => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const ingredients: TIngredient[] = useSelector(getIngredients);

  const feedOrders = useSelector(getFeedOrders);
  const profileOrders = useSelector(getProfileOrders);

  const fallbackOrder = useSelector(getOrderInfo);
  const isOrderLoading = useSelector(getIsOrderInfoLoading);

  const orderNumber = Number(number);

  const orderFromStore =
    feedOrders.find((o) => o.number === orderNumber) ||
    profileOrders.find((o) => o.number === orderNumber) ||
    null;

  const orderData = orderFromStore || fallbackOrder;

  useEffect(() => {
    if (!orderFromStore && !fallbackOrder && Number.isFinite(orderNumber)) {
      dispatch(fetchOrderByNumberThunk(orderNumber));
    }
  }, [dispatch, orderNumber, orderFromStore, fallbackOrder]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        if (!acc[itemId]) {
          const ingredient = ingredients.find((ing) => ing._id === itemId);
          if (ingredient) {
            acc[itemId] = { ...ingredient, count: 1 };
          }
        } else {
          acc[itemId].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} isModal={isModal} />;
};
