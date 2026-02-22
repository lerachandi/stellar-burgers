import { FC, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUserThunk, getUser } from '../../services/slices/user/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const navigate = useNavigate();
  const location = useLocation();

  const hasRedirected = useRef(false);

  const state = location.state as { from?: { pathname?: string } } | null;
  const fromPathname = state?.from?.pathname;

  const redirectTo =
    fromPathname && fromPathname !== '/login' ? fromPathname : '/';

  useEffect(() => {
    if (!user) return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;

    // если вдруг redirectTo совпал с текущим — всё равно отправляем на /
    const target = location.pathname === redirectTo ? '/' : redirectTo;
    navigate(target, { replace: true });
  }, [user, redirectTo, navigate, location.pathname]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
