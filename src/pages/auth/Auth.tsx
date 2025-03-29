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

import { useAdminLoginMutation,  useUserLoginMutation} from "../../store/api/auth";

const b = block("auth-page");

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  const [toAdminLogin, {
    data: loginData, 
    ...loginRequestInfo
  }] = useAdminLoginMutation();

  const [toUserLogin, {
    data: login, 
    ...requestInfo
  }] = useUserLoginMutation();


  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isPhone, setIsPhone] = React.useState(false);
  const [isLoginButtonClicked, setIsLoginButtonClicked] = React.useState(false);


  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    
    if (numbers.length > 1) {
      formatted = `+7${numbers.substring(1,11)}`;
    }
    
    return formatted.trim();
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isPhoneInput = /^[\d+]/.test(value);
    
    setIsPhone(isPhoneInput);
    setUserName(isPhoneInput ? formatPhone(value) : value);
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

    try {

      const loginValue = isPhone ? username.replace(/\D/g, '') : username;
      
      await toAdminLogin({
        username: loginValue,
        password
      }).unwrap();
      

      navigate(NavigationPath.AdminPage);
    } catch (err) {
      setError("Неверные учетные данные");
    }
  };

  const handleOnClickLoginButton = () => {
    if (username && password) {
      toAdminLogin({ username, password });
      setIsLoginButtonClicked(true);
      setError("");
      // localStorage.setItem('accessToken', "1");
      // navigate(NavigationPath.PromotionsPage);
    } else {
      setError("Заполните логин и пароль")
    }
  };


  React.useEffect(() => {
    if (loginRequestInfo.isSuccess) {
      localStorage.setItem('accessToken', loginData?.result.token!);
      localStorage.setItem('refreshToken', loginData?.result.refreshToken!);
      navigate(NavigationPath.AdminPage);
      setIsLoginButtonClicked(false);
    }
  }, [loginRequestInfo.isSuccess, loginData?.result.token, loginData?.result.refreshToken, navigate]);

  React.useEffect(() => {
    if (loginRequestInfo.isError) {
      toUserLogin({ username, password });
      if (requestInfo.isSuccess) {
        localStorage.setItem('accessToken', login?.result.token!);
        localStorage.setItem('refreshToken', login?.result.refreshToken!);
        navigate(NavigationPath.UserAccount);
        setIsLoginButtonClicked(false);
      }
      else{
        setIsLoginButtonClicked(false);
      if (loginRequestInfo.error && 'error' in loginRequestInfo.error){
        setError(loginRequestInfo.error.error.message)
      }
    }
      }
    }, [loginRequestInfo.isError, loginRequestInfo.error,loginRequestInfo.isSuccess, loginData?.result.token, loginData?.result.refreshToken, navigate]);


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
          loading={isLoginButtonClicked}
          onClick={handleOnClickLoginButton}
          disabled={!username || !password}
          style={{ marginTop: 20 }}
        >
          ВОЙТИ
        </PrimaryButton>
      </form>
    </div>
  );
};
