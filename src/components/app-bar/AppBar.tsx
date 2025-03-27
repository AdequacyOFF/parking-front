import React from 'react';
import block from 'bem-cn-lite';
import { Button, Tabs } from '@gravity-ui/uikit';
import './AppBar.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationPath } from '../../utils/constant/navigation';
import { ConditionModal } from '../condition-modal';
import { Stack } from '@mui/material';

const b = block('app-bar');

export const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = React.useState(location.pathname || '/marks');

  const [openLogoutModal, setOpenLogoutModal] = React.useState(false);
  const handleOnLogoutClick = () => setOpenLogoutModal(true);
  const closeLogoutClick = () => setOpenLogoutModal(false);

  const logout = () => {
    closeLogoutClick();
    localStorage.clear();
    navigate(NavigationPath.LoginPage);
  };

  const handleOnTabClick = (path: string) => {
    navigate(path);
    setTab(path);
  };

  return (
    <div className={b()}>
      <Stack direction="row" alignItems="center" position="relative">
        {/* <div className={b('logo-wrapper')}>
          <img src={logo} alt="logo" />
        </div>
        <Label theme="clear" className={b("version")}>
          Версия {process.env.REACT_APP_VERSION}
        </Label> */}
      </Stack>
      <Tabs activeTab={tab} size="l">
        <Tabs.Item
          id={NavigationPath.PromotionsPage}
          title="Акции"
          onClick={() => handleOnTabClick(NavigationPath.PromotionsPage)}
        />
        {/* <Tabs.Item 
          id={NavigationPath.QRPage}
          title="Генерация QR-кодов" 
          onClick={handleOnTabClick} 
        />
        <Tabs.Item 
          id={NavigationPath.GenManagePage}
          title="Управление генерациями" 
          onClick={handleOnTabClick} 
        /> */}
        <Tabs.Item
          id={NavigationPath.FuelPage}
          title="Топливо"
          onClick={() => handleOnTabClick(NavigationPath.FuelPage)}
        />
      </Tabs>
      <div className={b('user-setting')}>
        <Button size="l" view="outlined-danger" onClick={handleOnLogoutClick}>
          Выйти
        </Button>
      </div>

      <ConditionModal open={openLogoutModal} onOk={logout} onClose={closeLogoutClick} />
    </div>
  );
};
