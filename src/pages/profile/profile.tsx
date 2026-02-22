import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, updateUserThunk } from '../../services/slices/user/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [initialForm, setInitialForm] = useState({
    name: '',
    email: ''
  });

  const [updateUserError, setUpdateUserError] = useState('');

  useEffect(() => {
    if (!user) return;

    const nextInitial = { name: user.name ?? '', email: user.email ?? '' };

    setInitialForm(nextInitial);
    setFormValue((prev) => ({
      ...prev,
      name: nextInitial.name,
      email: nextInitial.email,
      password: ''
    }));
  }, [user?.name, user?.email]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== initialForm.name ||
      formValue.email !== initialForm.email ||
      Boolean(formValue.password),
    [formValue, initialForm]
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateUserError('');

    try {
      await dispatch(
        updateUserThunk({
          name: formValue.name,
          email: formValue.email,
          ...(formValue.password ? { password: formValue.password } : {})
        })
      ).unwrap();

      setInitialForm({ name: formValue.name, email: formValue.email });
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch {
      setUpdateUserError('Не удалось обновить данные профиля');
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateUserError('');
    setFormValue({
      name: initialForm.name,
      email: initialForm.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
