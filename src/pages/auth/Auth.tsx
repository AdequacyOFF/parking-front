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
import { useAdminLoginMutation, useUserLoginMutation } from "../../store/api/auth";

const b = block("auth-page");

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isPhone, setIsPhone] = React.useState(false);
  const [isLoginButtonClicked, setIsLoginButtonClicked] = React.useState(false);

  const [userLogin] = useUserLoginMutation();
  const [adminLogin] = useAdminLoginMutation();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isPhoneInput = /^[\d+]/.test(value);
    
    setIsPhone(isPhoneInput);
    setUserName(value);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Введите логин или телефон");
      return;
    }

    if (!password.trim()) {
      setError("Введите пароль");
      return;
    }

    if (isPhone && !/^\+?\d{10,15}$/.test(username.replace(/\D/g, ''))) {
      setError("Введите корректный номер телефона");
      return;
    }
    setError("");

    setIsLoginButtonClicked(true);
    setError("");

    try {
      // Определяем, какой endpoint использовать
      const isAdminAttempt = username.includes('admin') || username.includes('@admin');
      const successPath = isAdminAttempt ? NavigationPath.AdminPage : NavigationPath.UserAccount;

      if(isAdminAttempt){
        const response = await adminLogin({
          username: isPhone ? username.replace(/\D/g, '') : username,
          password
        }).unwrap();
  
        localStorage.setItem('accessToken', response.result.token);
        localStorage.setItem('refreshToken', response.result.refreshToken);
        navigate(successPath);
      }
      else{
        const response = await userLogin({
          phoneNumber: isPhone? username.replace(/\D/g, '') : username,
          password
        }).unwrap();
        localStorage.setItem('accessToken', response.result.token);
        localStorage.setItem('refreshToken', response.result.refreshToken);
        navigate(successPath);
      }
      
    } catch (err) {
      setError("Неверные учетные данные");
    } finally {
      setIsLoginButtonClicked(false);
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
              value={username}
              onChange={handleLoginChange}
              type={isPhone ? "tel" : "text"}
              placeholder={isPhone ? "Ваш телефон" : "Ваш логин"}
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
          loading={isLoginButtonClicked}
          disabled={!username || !password}
          style={{ marginTop: 20 }}
        >
          ВОЙТИ
        </PrimaryButton>
      </form>
    </div>
  );
};