import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SettingsPage from './pages/SettingsPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryFormPage from './pages/CategoryFormPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Защищённые маршруты с Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserFormPage />} />
            <Route path="/users/:id/edit" element={<UserFormPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Категории */}
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/categories/new" element={<CategoryFormPage />} />
            <Route path="/admin/categories/:id/edit" element={<CategoryFormPage />} />

            {/* Товары */}
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route path="/admin/products/new" element={<ProductFormPage />} />
            <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}