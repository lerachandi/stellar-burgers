import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeedsThunk,
  getFeedOrders,
  getIsFeedLoading
} from '../../services/slices/feed/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getFeedOrders);
  const isLoading = useSelector(getIsFeedLoading);

  useEffect(() => {
    dispatch(fetchFeedsThunk());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeedsThunk())}
    />
  );
};
