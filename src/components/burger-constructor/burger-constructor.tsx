import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorIngredients,
  getConstructorBun,
  clearConstructor
} from '../../services/slices/burger-constructor/burgerConstructorSlice';

import { getUser } from '../../services/slices/user/userSlice';
import {
  createOrderThunk,
  getOrderModalData,
  getOrderRequest,
  resetOrder
} from '../../services/slices/order/orderSlice';

export const BurgerConstructor: FC = () => {
  const bun = useSelector(getConstructorBun);
  const ingredients = useSelector(getConstructorIngredients);
  const user = useSelector(getUser);

  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = { bun, ingredients };

  const ingredientIds = useMemo(() => {
    if (!bun) return [];
    const ids = ingredients.map((item) => item._id);
    return [bun._id, ...ids, bun._id];
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    if (!bun || orderRequest) return;

    dispatch(createOrderThunk(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => {});
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
