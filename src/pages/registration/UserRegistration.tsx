import React from 'react';
import block from 'bem-cn-lite';
import { Button, TextInput, useToaster, Spin } from '@gravity-ui/uikit';
import { Layout } from '../../components/layout';
import { Box, Stack } from '@mui/material';
import { useRegisterUserMutation } from '../../store/api/admin';

import './UserRegistration.scss';

const b = block('fuel-page');


export const UserRegistrationPage: React.FC = () => {
  const { add } = useToaster();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [formData, setFormData] = React.useState({
    lastName: '',
    firstName: '',
    patronymic: '',
    phoneNumber: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.lastName || !formData.firstName || !formData.phoneNumber) {
      add({
        name: 'registration-error',
        title: 'Ошибка',
        content: 'Заполните все обязательные поля',
        autoHiding: 3000,
      });
      return;
    }

    try {
      // Вызываем мутацию и получаем ответ
      const result = await registerUser({
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        patronymic: formData.patronymic
      }).unwrap();

      // Правильно типизированный доступ к данным ответа
      add({
        name: 'registration-success',
        title: 'Успешно',
        content: `Пользователь ${result.result.firstName} зарегистрирован`,
        autoHiding: 3000,
      });

      // Сброс формы
      setFormData({
        lastName: '',
        firstName: '',
        patronymic: '',
        phoneNumber: ''
      });

    } catch (error) {
      const errorContent = (error as { data?: { message?: string } })?.data?.message 
        || 'Ошибка при регистрации';
      
      add({
        name: 'registration-error',
        title: 'Ошибка',
        content: errorContent,
        autoHiding: 3000,
      });
    }
  };

  return (
    <Layout>
      <div className={b()}>
        <div className={b('container')}>
          <div className={b('wrapper')}>
            <Stack spacing={2} direction="column">
              <TextInput
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Фамилия"
                size="l"
                
              />

              <TextInput
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Имя"
                size="l"
                
              />

              <TextInput
                name="patronymic"
                value={formData.patronymic}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Отчество"
                size="l"
              />

              <TextInput
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Телефон"
                size="l"
                type="tel"
                
              />

              <Button
                view="action"
                size="l"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
              >
                Зарегистрировать
              </Button>
            </Stack>

            {isLoading && (
              <Box className={b('loading')}>
                <Spin size="xl" />
              </Box>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};