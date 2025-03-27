import React from 'react';
import block from 'bem-cn-lite';
import { Button, TextInput, useToaster, Spin } from '@gravity-ui/uikit';
import { useLazyGetFuelVolumeQuery, useUpdateFuelVolumeMutation } from '../../store/api/admin';
import { Layout } from '../../components/layout';
import { Box, Stack } from '@mui/material';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import './Fuel.scss'; // Подключаем стили

const b = block('fuel-page'); // Создаем блок для стилей

export const FuelPage: React.FC = () => {
  const { add } = useToaster();

  // Хук для получения текущего объема топлива
  const [getFuelVolume, { data, isFetching: isFetchingVolume }] = useLazyGetFuelVolumeQuery();

  // Хук для обновления объема топлива
  const [updateFuelVolume, { isLoading: isUpdating }] = useUpdateFuelVolumeMutation();

  // Состояние для хранения нового значения объема
  const [volume, setVolume] = React.useState<number | null>(null);

  // Загружаем текущее значение при монтировании компонента
  React.useEffect(() => {
    getFuelVolume();
  }, [getFuelVolume]);

  // Обновляем состояние volume при получении данных
  React.useEffect(() => {
    if (data?.result?.minFuelVolume) {
      setVolume(data.result.minFuelVolume);
    }
  }, [data]);

  // Обработчик для обновления объема топлива
  const handleUpdateFuelVolume = async () => {
    if (volume === null || isNaN(volume)) {
      add({
        name: 'update-fuel-volume-error',
        title: 'Ошибка',
        content: 'Введите корректное значение объема топлива',
        autoHiding: 3000,
      });
      return;
    }

    // Приводим volume к целому числу
    const intVolume = Math.floor(volume);

    // Проверяем, что объем является положительным числом
    if (intVolume <= 0) {
      add({
        name: 'update-fuel-volume-error',
        title: 'Ошибка',
        content: 'Объем топлива должен быть положительным числом',
        autoHiding: 3000,
      });
      return;
    }

    try {
      // Отправляем запрос на сервер
      const response = await updateFuelVolume({ volume: intVolume }).unwrap();
      console.log('Ответ сервера:', response);

      add({
        name: 'update-fuel-volume-success',
        title: 'Успешно',
        content: 'Объем топлива успешно обновлен',
        autoHiding: 3000,
      });
    } catch (error) {
      console.error('Ошибка при обновлении объема топлива:', error);

      // Уточняем тип ошибки
      const fetchError = error as FetchBaseQueryError;

      // Выводим детали ошибки, если они есть
      const errorMessage =
        (fetchError.data as { detail?: string })?.detail ||
        'Не удалось обновить объем топлива';

      add({
        name: 'update-fuel-volume-error',
        title: 'Ошибка',
        content: errorMessage,
        autoHiding: 3000,
      });
    }
  };

  return (
    <Layout>
      <div className={b()}>
        <div className={b('container')}>
          <div className={b('wrapper')}>
            <Stack spacing={2} direction="row" alignItems="center">
              <TextInput
                type="number"
                value={volume?.toString() || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setVolume(isNaN(value) ? null : value);
                }}
                disabled={isFetchingVolume || isUpdating}
                placeholder="Введите объем топлива"
              />
              <Button
                view="outlined-danger"
                size="l"
                onClick={handleUpdateFuelVolume}
                loading={isUpdating}
                disabled={isFetchingVolume || isUpdating}
              >
                Обновить
              </Button>
            </Stack>

            {isFetchingVolume ? (
              <Box className={b('loading')}>
                <Spin />
              </Box>
            ) : (
              <Box className={b('current-value')}>
                Текущее минимальное значение топлива: {data?.result?.minFuelVolume}
              </Box>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
