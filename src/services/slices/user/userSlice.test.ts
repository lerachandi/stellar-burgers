import reducer, {
  checkUserAuth,
  loginUserThunk,
  registerUserThunk,
  logoutThunk,
  getUserThunk,
  updateUserThunk
} from './userSlice';

describe('userSlice', () => {
  it('начальное состояние', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null
    });
  });

  it('checkUserAuth.pending: начало загрузки и сброс ошикби', () => {
    const state = reducer(undefined, { type: checkUserAuth.pending.type });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('checkUserAuth.fulfilled: ставит isAuthChecked=true и завершает загрузку', () => {
    const state = reducer(undefined, {
      type: checkUserAuth.fulfilled.type,
      payload: null
    });

    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('loginUserThunk.fulfilled: сохранение пользователя', () => {
    const payload = { email: 'pomogi@te.ru', name: 'test' };

    const state = reducer(undefined, {
      type: loginUserThunk.fulfilled.type,
      payload
    });

    expect(state.user).toEqual(payload);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('registerUserThunk.fulfilled: сохранение пользователя', () => {
    const payload = { email: 'pomogi@te.ru', name: 'test' };

    const state = reducer(undefined, {
      type: registerUserThunk.fulfilled.type,
      payload
    });

    expect(state.user).toEqual(payload);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('logoutThunk.fulfilled: очищает пользователя', () => {
    const loggedIn = reducer(undefined, {
      type: loginUserThunk.fulfilled.type,
      payload: { email: 'pomogi@te.ru', name: 'test' }
    });

    const state = reducer(loggedIn, { type: logoutThunk.fulfilled.type });

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('getUserThunk.fulfilled: обновляет пользователя', () => {
    const payload = { email: 'pomogi@te.ru', name: 'test' };

    const state = reducer(undefined, {
      type: getUserThunk.fulfilled.type,
      payload
    });

    expect(state.user).toEqual(payload);
  });

  it('updateUserThunk.fulfilled: обновляет пользователя', () => {
    const payload = { email: 'pomogi@te.ru', name: 'updated' };

    const state = reducer(undefined, {
      type: updateUserThunk.fulfilled.type,
      payload
    });

    expect(state.user).toEqual(payload);
  });
});
