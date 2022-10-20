import { Outlet } from 'react-router-dom';

import NavBar from './navbar';

import './applayout.css';

const AppLayout = () => (
  <>
    <div className="skeleton">
      <NavBar />
      <Outlet />
    </div>
  </>
);

export default AppLayout;