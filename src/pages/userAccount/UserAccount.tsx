import React, { useState, useEffect } from "react";
import "./UserAccount.scss";
import { TextInput } from "@gravity-ui/uikit";
import { InputLabel } from "../../components/input-label";
import { PrimaryButton } from "../../components/button";
import axios from "axios";
import { useToaster } from "@gravity-ui/uikit";

interface UserData {
  id: string;
  phoneNumber: string;
  status: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  parkingSpace?: string;
}

interface CarData {
  mark: string;
  number: string;
  region: string;
}

// Заглушки для данных пользователя
const DEFAULT_USER: UserData = {
  id: "",
  phoneNumber: "",
  status: "UNKNOWN",
  firstName: "Имя",
  lastName: "Фамилия",
  patronymic: "",
  parkingSpace: "##"
};

export const UserAccount: React.FC = () => {
  const [user, setUser] = useState<UserData>(DEFAULT_USER);
  const [cars, setCars] = useState<CarData[]>([{ mark: "", number: "", region: "" }]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const { add } = useToaster();

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<{
          errorCode: number;
          message: string;
          result: UserData;
        }>("/api/users/me");
        
        if (response.data.errorCode === 0) {
          setUser(response.data.result);
          setDataError(false);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        setDataError(true);
        add({
          name: "user-data-error",
          title: "Ошибка",
          content: "Не удалось загрузить данные пользователя",
          autoHiding: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [add]);

  // Остальные обработчики остаются без изменений
  const handleCarChange = (index: number, field: keyof CarData, value: string) => {
    const updatedCars = [...cars];
    updatedCars[index] = { ...updatedCars[index], [field]: value };
    setCars(updatedCars);
  };

  const handleSave = async (index: number) => {
    try {
      await axios.put("/api/user/cars", cars[index]);
      add({
        name: "save-success",
        title: "Успех",
        content: "Данные автомобиля сохранены",
        autoHiding: 3000,
      });
    } catch (error) {
      add({
        name: "save-error",
        title: "Ошибка",
        content: "Не удалось сохранить данные",
        autoHiding: 3000,
      });
    }
  };

  const handleAddCar = () => {
    setCars([...cars, { mark: "", number: "", region: "" }]);
  };

  const handleReserveSpace = async () => {
    try {
      await axios.post("/api/user/reserve-space");
      add({
        name: "reserve-success",
        title: "Успех",
        content: "Место успешно зарезервировано",
        autoHiding: 3000,
      });
      const response = await axios.get("/api/users/me");
      setUser(response.data.result);
      setDataError(false);
    } catch (error) {
      add({
        name: "reserve-error",
        title: "Ошибка",
        content: "Не удалось зарезервировать место",
        autoHiding: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="body">
        <div className="header">ЛИЧНЫЙ КАБИНЕТ</div>
        <div className="loading-placeholder">Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className="body">
      <div className="header">ЛИЧНЫЙ КАБИНЕТ</div>
      <div className="main-conteiner">
        {/* Отображаем данные пользователя или заглушки */}
        <div className={`name ${dataError ? 'placeholder-text' : ''}`}>
          {dataError ? 'Пользователь' : `${user.firstName} ${user.lastName}`}
        </div>
        
        <div className="heading">Ваше парковочное место</div>
        <div className={`parking-space ${dataError ? 'placeholder-text' : ''}`}>
          {user.parkingSpace || "##"}
        </div>
        
        <hr className="one" />
        
        <div className="car-data-header">Данные автомобиля</div>
        
        {cars.map((car, index) => (
          <div key={index} className="car-mark">
            <InputLabel labelText="Марка автомобиля">
              <TextInput
                value={car.mark}
                onChange={(e) => handleCarChange(index, "mark", e.target.value)}
                style={{ color: "#ffffff" }}
                type="text"
                placeholder={dataError ? "Данные не загружены" : "Марка автомобиля"}
                className="input"
                size="xl"
                controlProps={{ style: { color: "#ffffff" } }}
                disabled={dataError}
              />
            </InputLabel>
            
            {/* Аналогично для других полей */}
            <InputLabel labelText="Номер автомобиля">
              <TextInput
                value={car.number}
                onChange={(e) => handleCarChange(index, "number", e.target.value)}
                style={{ color: "#ffffff" }}
                type="text"
                placeholder={dataError ? "Данные не загружены" : "Номер автомобиля"}
                className="input"
                size="xl"
                controlProps={{ style: { color: "#ffffff" } }}
                disabled={dataError}
              />
            </InputLabel>
            
            <InputLabel labelText="Регион">
              <TextInput
                value={car.region}
                onChange={(e) => handleCarChange(index, "region", e.target.value)}
                style={{ color: "#ffffff" }}
                type="text"
                placeholder={dataError ? "Данные не загружены" : "Регион"}
                className="input"
                size="xl"
                controlProps={{ style: { color: "#ffffff" } }}
                disabled={dataError}
              />
            </InputLabel>
            
            <PrimaryButton 
              type="button" 
              size="xl" 
              style={{ marginTop: 20 }}
              onClick={() => handleSave(index)}
              disabled={dataError}
            >
              СОХРАНИТЬ
            </PrimaryButton>
            
            {index === cars.length - 1 && <hr className="two" />}
          </div>
        ))}
        
        <div className="add-car">
          <PrimaryButton 
            type="button" 
            size="xl" 
            style={{ marginTop: 20 }}
            onClick={handleAddCar}
          >
            ДОБАВИТЬ МАШИНУ
          </PrimaryButton>
        </div>
        
        <div className="add-space">
          <PrimaryButton 
            type="button" 
            size="xl" 
            style={{ marginTop: 20 }}
            onClick={handleReserveSpace}
            disabled={dataError}
          >
            Зарезервировать место
          </PrimaryButton>
        </div>
        
        {dataError && (
          <div className="data-error-message">
            Не удалось загрузить данные. Попробуйте обновить страницу.
          </div>
        )}
      </div>
    </div>
  );
};
// import React from "react";
// import "./UserAccount.scss";
// import { TextInput } from "@gravity-ui/uikit";
// import { InputLabel } from "../../components/input-label";
// import { PrimaryButton } from "../../components/button";

// export const UserAccount: React.FC = () => {
//   return (
//     <div className="body">
//       <div className="header">ЛИЧНЫЙ КАБИНЕТ</div>
//       <div className="main-conteiner">
//         <div className="name">Имя Фамилия</div>
//         <div className="heading">Ваше парковочное место</div>
//         <div className="parking-space">69</div>
//         <hr className="one" />
//         <div className="car-data-header">Данные автомобиля</div>
//         <div className="car-mark">
//           <InputLabel labelText="Марка автомобиля">
//             <TextInput
//               style={{ color: "#ffffff" }}
//               type="text"
//               placeholder="Марка автомобиля"
//               className="input"
//               size="xl"
//               controlProps={{ style: { color: "#ffffff" } }}
//             ></TextInput>
//           </InputLabel>
//           <InputLabel labelText="Номер автомобиля">
//             <TextInput
//               style={{ color: "#ffffff" }}
//               type="text"
//               placeholder="Номер автомобиля"
//               className="input"
//               size="xl"
//               controlProps={{ style: { color: "#ffffff" } }}
//             ></TextInput>
//           </InputLabel>
//           <InputLabel labelText="Регион">
//             <TextInput
//               style={{ color: "#ffffff" }}
//               type="text"
//               placeholder="Регион"
//               className="input"
//               size="xl"
//               controlProps={{ style: { color: "#ffffff" } }}
//             ></TextInput>
//           </InputLabel>
//           <PrimaryButton type="submit" size="xl" style={{ marginTop: 20 }}>
//             СОХРАНИТЬ
//           </PrimaryButton>
//           <hr className="two" />
//         </div>
//         <div className="add-car">
//           <PrimaryButton type="submit" size="xl" style={{ marginTop: 20 }}>
//             ДОБАВИТЬ МАШИНУ
//           </PrimaryButton>
//         </div>
//         <div className="add-space">
//           <PrimaryButton type="submit" size="xl" style={{ marginTop: 20 }}>
//             Зарезервировать место
//           </PrimaryButton>
//         </div>
//       </div>
//     </div>
//   );
// };
