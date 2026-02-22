import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrdersThunk,
  getProfileOrders,
  getIsProfileOrdersLoading
} from '../../services/slices/profile-orders/profileOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getProfileOrders);
  const isLoading = useSelector(getIsProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchProfileOrdersThunk());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
