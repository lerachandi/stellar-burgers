import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie, getCookie } from '../../../utils/cookie';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../../utils/burger-api';
import { TUser } from '../../../utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const getUserThunk = createAsyncThunk('user/getUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logoutThunk = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    const res = await getUserApi();
    return res.user;
  } catch (e) {
    return null;
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getIsUserLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка проверки авторизации';
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })

      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  }
});

export const { getUser, getIsAuthChecked, getIsUserLoading } =
  userSlice.selectors;

export default userSlice.reducer;
