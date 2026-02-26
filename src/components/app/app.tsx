import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, OrderInfo, Modal } from '@components';
import {
  ConstructorPage,
  Feed,
  Profile,
  ProfileOrders,
  Login,
  ForgotPassword,
  Register,
  ResetPassword,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { ProtectedRoute } from '../protected-route';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/user/userSlice';
import { fetchBurgerIngredients } from '../../services/slices/burger-ingredients/burgerIngredientsSlice';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { background?: Location } | null;
  const backgroundLocation = state?.background;

  const handleCloseModal = () => navigate(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchBurgerIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/profile'
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
