import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { theme } from '@/styles/theme';
import '@/styles/global.css';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Dashboard from '@/pages/Home/Dashboard';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';
import LeadList from '@/pages/Leads/LeadList';
import LeadForm from '@/pages/Leads/LeadForm';
import LeadDetail from '@/pages/Leads/LeadDetail';
import ContactList from '@/pages/Contacts/ContactList';
import ContactForm from '@/pages/Contacts/ContactForm';
import ContactDetail from '@/pages/Contacts/ContactDetail';
import AccountList from '@/pages/Accounts/AccountList';
import AccountForm from '@/pages/Accounts/AccountForm';
import AccountDetail from '@/pages/Accounts/AccountDetail';

// Components
import ProtectedRoute from '@/components/common/ProtectedRoute';

function App() {
  return (
    <ConfigProvider theme={theme} locale={esES}>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <Register />
              </AuthLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <AuthLayout>
                <ResetPassword />
              </AuthLayout>
            }
          />

          {/* Protected Main Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes for sidebar navigation */}
          <Route
            path="/leads"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <LeadList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/new"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <LeadForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <LeadDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id/edit"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <LeadForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ContactList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts/new"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ContactForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ContactDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts/:id/edit"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ContactForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AccountList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/new"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AccountForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AccountDetail />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/:id/edit"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AccountForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deals"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>Módulo de Oportunidades (Próximamente)</div>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>Módulo de Propiedades (Próximamente)</div>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>Módulo de Cotizaciones (Próximamente)</div>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>Módulo de Actividades (Próximamente)</div>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>Módulo de Reportes (Próximamente)</div>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/automation"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>Módulo de Automatización (Próximamente)</div>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <MainLayout>
                  <div>Panel de Administración (Próximamente)</div>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
