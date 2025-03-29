import React from 'react';
import block from 'bem-cn-lite';
import { Button, Tabs } from '@gravity-ui/uikit';
import './AppBar.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationPath } from '../../utils/constant/navigation';
import { ConditionModal } from '../condition-modal';

const b = block('app-bar');

// Заглушки для маршрутов других ролей
const USER_ROUTES = {
  Dashboard: '/user/dashboard',
  History: '/user/history'
};

const SECURITY_ROUTES = {
  Check: '/security/check',
  Reports: '/security/reports'
};

// Маппинг ролей на русские названия
const ROLE_TITLES = {
  admin: 'ПРОСТО АДМИН',
  user: 'ПРОСТО ПОЛЬЗОВАТЕЛЬ',
  security: 'ПРОСТО ОХРАННИК'
};

export const AppBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const userRole = pathParts[1]; // 'admin', 'user' или 'security'

  const [tab, setTab] = React.useState(location.pathname);
  const [openLogoutModal, setOpenLogoutModal] = React.useState(false);

  const logout = () => {
    localStorage.clear();
    navigate(NavigationPath.LoginPage);
  };

  const handleTabClick = (path: string) => {
    navigate(path);
    setTab(path);
  };

  // Получаем русскоязычный заголовок для текущей роли
  const getRoleTitle = () => ROLE_TITLES[userRole as keyof typeof ROLE_TITLES] || '';

  // Рендер вкладок для администратора
  const renderAdminTabs = () => (
    <Tabs activeTab={tab} size="l" className={b('tabs')}>
      <Tabs.Item
        id={NavigationPath.AdminPage}
        title="Парковка"
        onClick={() => handleTabClick(NavigationPath.AdminPage)}
      />
      <Tabs.Item
        id={NavigationPath.UserRegistrationPage}
        title="Регистрация"
        onClick={() => handleTabClick(NavigationPath.UserRegistrationPage)}
      />
    </Tabs>
  );

  // Рендер вкладок для обычного пользователя
  const renderUserTabs = () => (
    <Tabs activeTab={tab} size="l" className={b('tabs')}>
      <Tabs.Item
        id={USER_ROUTES.Dashboard}
        title="Мои брони"
        onClick={() => handleTabClick(USER_ROUTES.Dashboard)}
      />
      <Tabs.Item
        id={USER_ROUTES.History}
        title="История"
        onClick={() => handleTabClick(USER_ROUTES.History)}
      />
    </Tabs>
  );

  // Рендер вкладок для охраны
  const renderSecurityTabs = () => (
    <Tabs activeTab={tab} size="l" className={b('tabs')}>
      <Tabs.Item
        id={SECURITY_ROUTES.Check}
        title="Проверка QR"
        onClick={() => handleTabClick(SECURITY_ROUTES.Check)}
      />
      <Tabs.Item
        id={SECURITY_ROUTES.Reports}
        title="Отчеты"
        onClick={() => handleTabClick(SECURITY_ROUTES.Reports)}
      />
    </Tabs>
  );

  // Выбор нужных вкладок по роли
  const renderRoleSpecificTabs = () => {
    switch(userRole) {
      case 'admin': return renderAdminTabs();
      case 'user': return renderUserTabs();
      case 'security': return renderSecurityTabs();
      default: return null;
    }
  };

  if (!['admin', 'user', 'security'].includes(userRole)) {
    return null;
  }

  return (
    <div className={b()}>
      <div className={b('title')}>
        {getRoleTitle()}
      </div>
      
      <div className={b('nav-container')}>
        {renderRoleSpecificTabs()}
      </div>
      
      <div className={b('user-setting')}>
        <Button 
          size="l" 
          view="outlined-danger" 
          onClick={() => setOpenLogoutModal(true)}
        >
          Выйти
        </Button>
      </div>

      <ConditionModal 
        open={openLogoutModal} 
        onOk={logout} 
        onClose={() => setOpenLogoutModal(false)} 
      />
    </div>
  );
};