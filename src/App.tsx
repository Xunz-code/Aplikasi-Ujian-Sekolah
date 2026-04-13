import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/app/Dashboard';
import AbsensiKaryawan from './pages/app/AbsensiKaryawan';
import AbsensiSiswa from './pages/app/AbsensiSiswa';
import DataSiswa from './pages/app/DataSiswa';
import UserManagement from './pages/app/UserManagement';
import RekapAbsensi from './pages/app/RekapAbsensi';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* App Routes (Protected) */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/app/dashboard" replace />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/app/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/app/absensi-karyawan" element={
            <ProtectedRoute>
              <Layout>
                <AbsensiKaryawan />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/app/absensi-siswa" element={
            <ProtectedRoute allowedRoles={['admin', 'guru']}>
              <Layout>
                <AbsensiSiswa />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/app/data-siswa" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <DataSiswa />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/app/user-management" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/app/rekap-absensi" element={
            <ProtectedRoute allowedRoles={['admin', 'guru']}>
              <Layout>
                <RekapAbsensi />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
