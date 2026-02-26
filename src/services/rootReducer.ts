import { combineReducers } from '@reduxjs/toolkit';
import burgerIngredientsReducer from './slices/burger-ingredients/burgerIngredientsSlice';
import ingredientDetailsReducer from './slices/ingredient-details/ingredientDetailsSlice';
import burgerConstructorReducer from './slices/burger-constructor/burgerConstructorSlice';
import userReducer from './slices/user/userSlice';
import orderReducer from './slices/order/orderSlice';
import feedReducer from './slices/feed/feedSlice';
import profileOrdersReducer from './slices/profile-orders/profileOrdersSlice';
import orderInfoReducer from './slices/order-info/orderInfoSlice';

export const rootReducer = combineReducers({
  burgerIngredients: burgerIngredientsReducer,
  ingredientDetails: ingredientDetailsReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  orderInfo: orderInfoReducer
});
