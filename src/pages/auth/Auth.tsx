import React from 'react';
import block from 'bem-cn-lite';
import {Button, Icon, Text, TextInput} from '@gravity-ui/uikit';

import './Auth.scss';
import {Eye, EyeSlash, Person} from '@gravity-ui/icons';
import {Lock} from '@gravity-ui/icons';
import {useNavigate} from 'react-router-dom';
import {NavigationPath} from '../../utils/constant/navigation';
import {PrimaryButton} from '../../components/button';
import {InputLabel} from '../../components/input-label';
import { Stack } from '@mui/material';

import { useLoginMutation } from '../../store/api/auth';

const b = block('auth-page');

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [toLogin, {
    data: loginData, 
    ...loginRequestInfo
  }] = useLoginMutation();

  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const [error, setError] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoginButtonClicked, setIsLoginButtonClicked] = React.useState(false);

  const handleOnChangeUsername = (e: any) => setUsername(e.target.value);
  const handleOnChangePassword = (e: any) => setPassword(e.target.value);

  const handleOnClickLoginButton = () => {
    if (username && password) {
      toLogin({ username, password });
      setIsLoginButtonClicked(true);
      setError("");
      // localStorage.setItem('accessToken', "1");
      // navigate(NavigationPath.PromotionsPage);
    } else {
      setError("Заполните логин и пароль")
    }
  };

  const handleOnPressEnter = (e: any) => {
    if (e.charCode === 13) handleOnClickLoginButton();
  };

  React.useEffect(() => {
    if (loginRequestInfo.isSuccess) {
      localStorage.setItem('accessToken', loginData?.result.token!);
      localStorage.setItem('refreshToken', loginData?.result.refreshToken!);
      navigate(NavigationPath.PromotionsPage);
      setIsLoginButtonClicked(false);
    }
  }, [loginRequestInfo.isSuccess, loginData?.result.token, loginData?.result.refreshToken, navigate]);

  React.useEffect(() => {
    if (loginRequestInfo.isError) {
      setIsLoginButtonClicked(false);
      if (loginRequestInfo.error && 'error' in loginRequestInfo.error){
        setError(loginRequestInfo.error.error.message)
      }
    }
  }, [loginRequestInfo.isError, loginRequestInfo.error]);

  return (
    <div className={b()}>
      <div className={b('form')}>
        <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
          {/* <Box className={b('logo-wrapper')}>
            <img src={logo} alt='logo' />
          </Box> */}
          <span className={b('title')}>Авторизация</span>
        </Stack>

        <Stack spacing={2}>
          <InputLabel labelText="Логин">
            <TextInput
              value={username}
              onChange={handleOnChangeUsername}
              onKeyPress={handleOnPressEnter}
              className={b('input')}
              size="xl"
              placeholder="Введите логин"
              startContent={<Person />}
            />
          </InputLabel>

          <InputLabel labelText="Пароль">
            <TextInput
              value={password}
              onChange={handleOnChangePassword}
              onKeyPress={handleOnPressEnter}
              type={showPassword ? "text" : "password"}
              className={b('input')}
              size="xl"
              placeholder="Введите пароль"
              startContent={<Lock />}
              endContent={
                <Button
                  view='flat'
                  onClick={toggleShowPassword}
                >
                  <Icon data={showPassword ? EyeSlash : Eye} size={20} />
                </Button>
              }
            />
          </InputLabel>
        </Stack>

        {error
          ? <Text 
              variant='body-1' 
              color='danger'
              style={{
                padding: '4px 0'
              }}
            >
              {error}
            </Text>
          : null
        }

        <PrimaryButton 
          size="xl" 
          loading={isLoginButtonClicked}
          onClick={handleOnClickLoginButton}
          style={{
            marginTop: 20
          }}
        >
          Войти
        </PrimaryButton>
      </div>
    </div>
  );
};
