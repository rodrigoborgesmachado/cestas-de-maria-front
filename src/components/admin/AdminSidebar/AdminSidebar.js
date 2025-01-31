import './AdminSidebar.css'; // Import the corresponding CSS file
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/redux/authSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import DashBoardIcon from '../../icons/DashBoardIcon';
import LogoffIcon from '../../icons/LogoffIcon';
import { useLocation } from 'react-router-dom';
import LogIcon from '../../icons/LogIcon';
import UsersIcon from '../../icons/UsersIcon';
import MailIcon from '../../icons/MailIcon';
import LogoIcon from '../../icons/LogoIcon';
import FamilyIcon from '../../icons/FamilyIcon';
import ReportIcon from '../../icons/ReportIcon';

const AdminSidebar = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    toast.success("Até breve!");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo flex-column center-component gap-default" >
        <LogoIcon size={80} color='#FFF'/>
        <p>
          Cestas de Maria
        </p>
      </div>
      <nav className="sidebar__menu">
        {isAdmin && <a href="/" className={pathSegments.length === 0 || (pathSegments[0] === 'dashboard') || pathSegments[1] === 'dashboard' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><DashBoardIcon color='white'/>Dashboard</a>}
        {isAdmin && <a href="/familias" className={pathSegments[0] === 'familias' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><FamilyIcon color='white'/>Famílias</a>}
        {isAdmin && <a href="/historico" className={pathSegments[0] === 'historico' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><ReportIcon color='white'/>Histórico Doações</a>}
        {isAdmin && <a href="/usuarios" className={pathSegments[0] === 'usuarios' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><UsersIcon color='white'/>Usuários</a>}
        {isAdmin && <a href="/emails" className={pathSegments[0] === 'emails' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><MailIcon color='white'/>Emails Enviados</a>}
        {isAdmin && <a href="/logs" className={pathSegments[0] === 'logs' ? "sidebar__menu-item sidebar__menu-item-selected" : "sidebar__menu-item"}><LogIcon color='white'/>Logs</a>}
        </nav>
      <button className="sidebar__logoff" onClick={handleLogout}>
        Sair <LogoffIcon color='white'/>
      </button>
    </aside>
  );
};

export default AdminSidebar;
