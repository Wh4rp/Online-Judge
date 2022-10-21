import { Outlet } from 'react-router-dom';

import NavBar from './navbar';

import './applayout.css';

const AppLayout = () => (
  <>
    <NavBar />
    <div className="skeleton">
      <Outlet />
    </div>
  </>
);

export default AppLayout;