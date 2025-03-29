import React from "react";
import block from "bem-cn-lite";
import { Button, Icon, Text, TextInput } from "@gravity-ui/uikit";

import "./Auth.scss";
import { Eye, EyeSlash, Person } from "@gravity-ui/icons";
import { Lock } from "@gravity-ui/icons";
import { useNavigate } from "react-router-dom";
import { NavigationPath } from "../../utils/constant/navigation";
import { PrimaryButton } from "../../components/button";
import { InputLabel } from "../../components/input-label";
import { Stack } from "@mui/material";

import { useLoginMutation } from "../../store/api/auth";

const b = block("auth-page");

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = React.useState(false);
  const [loginInput, setLoginInput] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isPhone, setIsPhone] = React.useState(false);


  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length > 1) {
      formatted = `+7 (${numbers.substring(1, 4)}) ${numbers.substring(4, 7)}-${numbers.substring(7, 9)}-${numbers.substring(9, 11)}`;
    }
    
    return formatted.trim();
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isPhoneInput = /^[\d+]/.test(value);
    
    setIsPhone(isPhoneInput);
    setLoginInput(isPhoneInput ? formatPhone(value) : value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginInput.trim()) {
      setError("Введите логин или телефон");
      return;
    }

    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }

    if (isPhone && !/^\+?\d{10,15}$/.test(loginInput.replace(/\D/g, ''))) {
      setError("Введите корректный номер телефона");
      return;
    }

    try {

      const loginValue = isPhone ? loginInput.replace(/\D/g, '') : loginInput;
      
      await login({
        login: loginValue,
        password
      }).unwrap();
      

      navigate(NavigationPath.AdminPage);
    } catch (err) {
      setError("Неверные учетные данные");
    }
  };

  return (
    <div className={b()}>
      <form className={b("form")} onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <span className={b("title")}>АВТОРИЗАЦИЯ</span>
        </Stack>

        <Stack spacing={2}>
          <InputLabel labelText={isPhone ? "Номер телефона" : "Логин"}>
            <TextInput
              style={{ color: "#ffffff" }}
              value={loginInput}
              onChange={handleLoginChange}
              type={isPhone ? "tel" : "text"}
              placeholder={isPhone ? "+7 (999) 123-45-67" : "Ваш логин"}
              className={b("input")}
              size="xl"
              startContent={<Person />}
              controlProps={{ style: { color: "#ffffff" } }}
            />
          </InputLabel>

          <InputLabel labelText="Пароль">
            <TextInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              type={showPassword ? "text" : "password"}
              placeholder="Введите пароль"
              className={b("input")}
              size="xl"
              startContent={<Lock />}
              endContent={
                <Button 
                  view="flat" 
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  <Icon data={showPassword ? EyeSlash : Eye} size={20} />
                </Button>
              }
              controlProps={{ style: { color: "#ffffff" } }}
            />
          </InputLabel>
        </Stack>

        {error && (
          <Text color="danger" style={{ padding: "4px 0" }}>
            {error}
          </Text>
        )}

        <PrimaryButton
          type="submit"
          size="xl"
          loading={isLoading}
          disabled={!loginInput || !password}
          style={{ marginTop: 20 }}
        >
          ВОЙТИ
        </PrimaryButton>
      </form>
    </div>
  );
};
