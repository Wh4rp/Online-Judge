import { Outlet } from 'react-router-dom'

import NavBar from './NavBar/NavBar'
import Footer from './Footer/Footer'

import './Layout.css'

const AppLayout = () => (
  <div id="page-container">
    <NavBar />
    <div className="skeleton">
      <Outlet />
    </div>
    <Footer />
  </div>
)

export default AppLayout