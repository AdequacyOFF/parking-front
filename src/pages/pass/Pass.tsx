import React, { useState } from 'react';
import './Pass.scss';
import { TextInput } from "@gravity-ui/uikit";
import { PrimaryButton } from "../../components/button";
import { useToaster } from "@gravity-ui/uikit";

interface UserData {
  firstName: string;
  lastName: string;
  patronymic: string;
  parkingSpace: string;
  isRegistered: boolean;
}

export const Pass: React.FC = () => {
  const [carNumber, setCarNumber] = useState('');
  const [region, setRegion] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const { add } = useToaster();

  // Заглушка для запроса к серверу
  const checkCarRegistration = async () => {
    setLoading(true);
    try {
      // Имитация запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Заглушка данных - в реальном приложении здесь будет ответ от сервера
      const mockResponse = {
        isRegistered: true,
        firstName: 'Иван',
        lastName: 'Иванов',
        patronymic: 'Иванович',
        parkingSpace: '42'
      };
      
      // В реальном приложении проверяем ответ сервера
      if (mockResponse.isRegistered) {
        setUserData(mockResponse);
        add({
          name: 'check-success',
          title: 'Успех',
          content: 'Пользователь найден',
          autoHiding: 3000,
        });
      } else {
        add({
          name: 'check-not-found',
          title: 'Информация',
          content: 'Пользователь с таким автомобилем не зарегистрирован',
          autoHiding: 3000,
        });
      }
    } catch (error) {
      add({
        name: 'check-error',
        title: 'Ошибка',
        content: 'Не удалось проверить регистрацию',
        autoHiding: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Заглушка для пропуска
  const handlePass = async () => {
    try {
      // Имитация запроса к серверу
      await new Promise(resolve => setTimeout(resolve, 500));
      
      add({
        name: 'pass-success',
        title: 'Успех',
        content: 'Пропуск оформлен',
        autoHiding: 3000,
      });
    } catch (error) {
      add({
        name: 'pass-error',
        title: 'Ошибка',
        content: 'Не удалось оформить пропуск',
        autoHiding: 3000,
      });
    }
  };

  return (
    <div className="pass-container">
      <h2 className="pass-title">Проверка пропуска</h2>
      
      <div className="pass-input-group">
        <TextInput
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          placeholder="Номер автомобиля"
          size="xl"
          disabled={loading}
          className="pass-input"
        />
        <TextInput
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Регион"
          size="xl"
          disabled={loading}
          className="pass-input"
        />
      </div>
      
      <PrimaryButton
      view="outlined-danger"
        onClick={checkCarRegistration}
        loading={loading}
        disabled={!carNumber || !region}
        size="xl"
        className="pass-button"
      >
        Проверить
      </PrimaryButton>
      
      {userData && (
        <div className="pass-user-info">
          <h3>Данные пользователя:</h3>
          <p>ФИО: {userData.lastName} {userData.firstName} {userData.patronymic}</p>
          <p>Парковочное место: {userData.parkingSpace}</p>
          
          <PrimaryButton
          view="outlined-danger"
            onClick={handlePass}
            size="xl"
            className="pass-button"
          >
            Пропустить
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};