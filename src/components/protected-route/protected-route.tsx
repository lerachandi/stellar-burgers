import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  getUser,
  getIsAuthChecked
} from '../../services/slices/user/userSlice';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  element: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  element,
  onlyUnAuth = false
}) => {
  const location = useLocation();

  const user = useSelector(getUser);
  const isAuthChecked = useSelector(getIsAuthChecked);

  const isAuth = Boolean(user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return element;
};
