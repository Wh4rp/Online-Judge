import { Outlet } from 'react-router-dom'

import NavBar from './navigation/NavBar/NavBar'

import './Layout.css'

const AppLayout = () => (
  <>
    <NavBar />
    <div className="skeleton">
      <Outlet />
    </div>
  </>
)

export default AppLayout