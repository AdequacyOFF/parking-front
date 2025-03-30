import React from 'react';
import block from 'bem-cn-lite';
import { Button, TextInput, useToaster, Spin, Icon } from '@gravity-ui/uikit';
import { Plus } from '@gravity-ui/icons';
import { Layout } from '../../components/layout';
import { Box, Stack } from '@mui/material';
import { useRegisterUserMutation, useAssignPlaceMutation } from '../../store/api/admin';
import './UserRegistration.scss';

const b = block('UR-page');

export const UserRegistrationPage: React.FC = () => {
  const { add } = useToaster();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();
  const [assignPlace, { isLoading: isAssigning }] = useAssignPlaceMutation();

  const [formData, setFormData] = React.useState({
    lastName: '',
    firstName: '',
    patronymic: '',
    phoneNumber: '' // Добавляем обратно phoneNumber, так как он обязателен в API
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
        content: 'Заполните обязательные поля (Фамилия, Имя, Телефон)',
        autoHiding: 3000,
        theme: 'danger',
      });
      return;
    }

    try {
      // 1. Регистрируем пользователя
      await registerUser({
        phoneNumber: formData.phoneNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        patronymic: formData.patronymic
      }).unwrap();

      // 2. Назначаем место (сервер сам выбирает свободное место)
      await assignPlace({
        firstName: formData.firstName,
        lastName: formData.lastName,
        patronymic: formData.patronymic
      }).unwrap();

      add({
        name: 'registration-success',
        title: 'Успешно',
        content: `Пользователь ${formData.firstName} ${formData.lastName} зарегистрирован. Место назначено автоматически.`,
        autoHiding: 3000,
        theme: 'success',
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
        theme: 'danger',
      });
    }
  };

  const isLoading = isRegistering || isAssigning;

  return (
    <Layout>
      <div className={b()}>
        <div className={b('container')}>
          <div className={b('wrapper')}>
            <h2 className={b('title')}>Регистрация пользователя и назначение места</h2>
            
            <Stack spacing={3} direction="column" sx={{ width: '100%', maxWidth: '500px' }}>
              <TextInput
                name="lastName"
                label="Фамилия*"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Введите фамилию"
                size="l"

              />

              <TextInput
                name="firstName"
                label="Имя*"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Введите имя"
                size="l"

              />

              <TextInput
                name="patronymic"
                label="Отчество"
                value={formData.patronymic}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Введите отчество (необязательно)"
                size="l"
              />

              <TextInput
                name="phoneNumber"
                label="Телефон*"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Введите номер телефона"
                size="l"
                type="tel"

              />

              <Button
                view="action"
                size="xl"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                pin="round-round"
              >
                <Icon data={Plus} size={18} />
                Зарегистрировать и назначить место
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