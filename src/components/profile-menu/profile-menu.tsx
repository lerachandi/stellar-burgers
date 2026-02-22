import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutThunk } from '../../services/slices/user/userSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/login', { replace: true });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
