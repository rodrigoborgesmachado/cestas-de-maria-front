import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../../layouts/admin/AdminLayout';
import DashboardPage from '../../pages/admin/DashboardPage/DashboardPage';
import LogListPage from '../../pages/admin/LogListPage/LogListPage';
import MailMessageListPage from '../../pages/admin/MailMessageListPage/MailMessageListPage';
import AdminsPage from '../../pages/admin/AdminsPage/AdminsPage';
import FamilyListPage from '../../pages/admin/FamilyListPage/FamilyListPage';
import FamilyPage from '../../pages/admin/FamilyPage/FamilyPage';
import AddFamilyPage from '../../pages/admin/AddFamilyPage/AddFamilyPage';

const AdminRoutes = () => (
  <AdminLayout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/logs" element={<LogListPage />} />
      <Route path="/emails" element={<MailMessageListPage />} />
      <Route path="/usuarios" element={<AdminsPage />} />
      <Route path="/familias" element={<FamilyListPage />} />
      <Route path="/familias/:code" element={<FamilyPage />} />
      <Route path="/familias/adicionar" element={<AddFamilyPage />} />
      <Route path="/familias/editar/:code" element={<AddFamilyPage />} />
      <Route path="/*" element={<DashboardPage />} />
      </Routes>
  </AdminLayout>
);

export default AdminRoutes;
