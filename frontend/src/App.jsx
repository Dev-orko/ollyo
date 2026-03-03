import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CustomerListPage from './pages/customers/CustomerListPage';
import CustomerFormPage from './pages/customers/CustomerFormPage';
import SupplierListPage from './pages/suppliers/SupplierListPage';
import SupplierFormPage from './pages/suppliers/SupplierFormPage';
import ProductListPage from './pages/products/ProductListPage';
import ProductFormPage from './pages/products/ProductFormPage';
import OrderListPage from './pages/orders/OrderListPage';
import OrderFormPage from './pages/orders/OrderFormPage';
import OpportunityListPage from './pages/opportunities/OpportunityListPage';
import OpportunityFormPage from './pages/opportunities/OpportunityFormPage';
import CertificationListPage from './pages/certifications/CertificationListPage';
import CertificationFormPage from './pages/certifications/CertificationFormPage';
import ComplianceLogListPage from './pages/compliance-logs/ComplianceLogListPage';
import ComplianceLogFormPage from './pages/compliance-logs/ComplianceLogFormPage';
import UserListPage from './pages/users/UserListPage';
import UserFormPage from './pages/users/UserFormPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        {/* Customers */}
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/new" element={<CustomerFormPage />} />
        <Route path="customers/:id/edit" element={<CustomerFormPage />} />

        {/* Suppliers */}
        <Route path="suppliers" element={<SupplierListPage />} />
        <Route path="suppliers/new" element={<SupplierFormPage />} />
        <Route path="suppliers/:id/edit" element={<SupplierFormPage />} />

        {/* Products */}
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />

        {/* Orders */}
        <Route path="orders" element={<OrderListPage />} />
        <Route path="orders/new" element={<OrderFormPage />} />
        <Route path="orders/:id/edit" element={<OrderFormPage />} />

        {/* Opportunities */}
        <Route path="opportunities" element={<OpportunityListPage />} />
        <Route path="opportunities/new" element={<OpportunityFormPage />} />
        <Route path="opportunities/:id/edit" element={<OpportunityFormPage />} />

        {/* Certifications */}
        <Route path="certifications" element={<CertificationListPage />} />
        <Route path="certifications/new" element={<CertificationFormPage />} />
        <Route path="certifications/:id/edit" element={<CertificationFormPage />} />

        {/* Compliance Logs */}
        <Route path="compliance-logs" element={<ComplianceLogListPage />} />
        <Route path="compliance-logs/new" element={<ComplianceLogFormPage />} />
        <Route path="compliance-logs/:id/edit" element={<ComplianceLogFormPage />} />

        {/* Users (Admin Only) */}
        <Route
          path="users"
          element={
            <ProtectedRoute adminOnly>
              <UserListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/new"
          element={
            <ProtectedRoute adminOnly>
              <UserFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <UserFormPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
