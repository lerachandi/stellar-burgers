import reducer, {
  checkUserAuth,
  loginUserThunk,
  registerUserThunk,
  logoutThunk,
  getUserThunk,
  updateUserThunk
} from './userSlice';

describe('userSlice', () => {
  const user = { email: 'pomogi@te.ru', name: 'test' };

  it('начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
  });

  it('checkUserAuth: начало загрузки и сброс ошибки', () => {
    const state = reducer(undefined, { type: checkUserAuth.pending.type });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('checkUserAuth: ставит isAuthChecked=true и завершает загрузку', () => {
    const state = reducer(undefined, {
      type: checkUserAuth.fulfilled.type,
      payload: null
    });

    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('loginUserThunk: сохраняет пользователя', () => {
    const state = reducer(undefined, {
      type: loginUserThunk.fulfilled.type,
      payload: user
    });

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('registerUserThunk: сохраняет пользователя', () => {
    const state = reducer(undefined, {
      type: registerUserThunk.fulfilled.type,
      payload: user
    });

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('logoutThunk: очищает пользователя', () => {
    const loggedIn = reducer(undefined, {
      type: loginUserThunk.fulfilled.type,
      payload: user
    });

    const state = reducer(loggedIn, { type: logoutThunk.fulfilled.type });

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('getUserThunk: обновляет пользователя', () => {
    const state = reducer(undefined, {
      type: getUserThunk.fulfilled.type,
      payload: user
    });

    expect(state.user).toEqual(user);
  });

  it('updateUserThunk: обновляет пользователя', () => {
    const updatedUser = { email: 'pomogi@te.ru', name: 'updated' };

    const state = reducer(undefined, {
      type: updateUserThunk.fulfilled.type,
      payload: updatedUser
    });

    expect(state.user).toEqual(updatedUser);
  });
});
