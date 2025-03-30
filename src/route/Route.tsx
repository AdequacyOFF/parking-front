import { AuthPage } from '../pages/auth';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { AdminPage } from '../pages/main';
import { UserRegistrationPage } from '../pages/registration';
import { UserAccount } from '../pages/userAccount';
import { ParkingSpaces } from '../pages/parkingSpaces';
import { Pass } from '../pages/pass';
import { NavigationPath } from '../utils/constant/navigation';


// const PrivateRoute = () => {
//   // const auth = localStorage.getItem('accessToken');
//   // return auth ? <Outlet /> : <Navigate to={NavigationPath.LoginPage} />;
//   return <Outlet />; // Всегда разрешаем доступ
// };

const PrivateRoute = () => {
  const auth = localStorage.getItem('accessToken');
  return auth ? <Outlet /> : <Navigate to={NavigationPath.LoginPage} />;
};

const UnAuthRoute = () => {
  const auth = localStorage.getItem('accessToken');
  return !auth ? <Outlet /> : <Navigate to={NavigationPath.AdminPage} />;
};

export const Routing = () => {
  return (
    <Routes>
      <Route path={NavigationPath.LoginPage} element={<UnAuthRoute />}>
        <Route path={NavigationPath.LoginPage} element={<AuthPage />} />
      </Route>

      <Route path={NavigationPath.AdminPage} element={<PrivateRoute />}>
        <Route path={NavigationPath.AdminPage} element={<AdminPage />} />
      </Route>

      <Route path={NavigationPath.UserRegistrationPage} element={<PrivateRoute />}>
        <Route path={NavigationPath.UserRegistrationPage} element={<UserRegistrationPage />} />
      </Route>

      <Route path={NavigationPath.UserAccount} element={<PrivateRoute />}>
        <Route path={NavigationPath.UserAccount} element={<UserAccount />} />
      </Route>

      <Route path={NavigationPath.ParkingSpaces} element={<PrivateRoute />}>
        <Route path={NavigationPath.ParkingSpaces} element={<ParkingSpaces />} />
      </Route>

      <Route path={NavigationPath. Pass} element={<PrivateRoute />}>
        <Route path={NavigationPath. Pass} element={<Pass />} />
      </Route>


      {/* <Route path={NavigationPath.Any} element={<PrivateRoute />}>
        <Route path={NavigationPath.Any} element={<Navigate to={NavigationPath.PromotionsPage} />} />
      </Route> */}
    </Routes>
  );
};
