import { AuthPage } from '../pages/auth';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { MainPage } from '../pages/main';
import { FuelPage } from '../pages/fuel';
import { NavigationPath } from '../utils/constant/navigation';

const PrivateRoute = () => {
  const auth = localStorage.getItem('accessToken');
  return auth ? <Outlet /> : <Navigate to={NavigationPath.LoginPage} />;
};

const UnAuthRoute = () => {
  const auth = localStorage.getItem('accessToken');
  return !auth ? <Outlet /> : <Navigate to={NavigationPath.PromotionsPage} />;
};

export const Routing = () => {
  return (
    <Routes>
      <Route path={NavigationPath.LoginPage} element={<UnAuthRoute />}>
        <Route path={NavigationPath.LoginPage} element={<AuthPage />} />
      </Route>

      <Route path={NavigationPath.PromotionsPage} element={<PrivateRoute />}>
        <Route path={NavigationPath.PromotionsPage} element={<MainPage />} />
      </Route>

      <Route path={NavigationPath.FuelPage} element={<PrivateRoute />}>
        <Route path={NavigationPath.FuelPage} element={<FuelPage />} />
      </Route>

      <Route path={NavigationPath.Any} element={<PrivateRoute />}>
        <Route path={NavigationPath.Any} element={<Navigate to={NavigationPath.PromotionsPage} />} />
      </Route>
    </Routes>
  );
};
