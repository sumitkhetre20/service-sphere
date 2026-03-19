import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages
import Login from './pages/auth/Login';
import CustomerRegister from './pages/auth/CustomerRegister';
import ProviderRegister from './pages/auth/ProviderRegister';

// Customer Pages
import Home from './pages/customer/Home';
import Services from './pages/customer/Services';
import ServiceDetails from './pages/customer/ServiceDetails';
import CustomerBookings from './pages/customer/Bookings';
import CustomerProfile from './pages/customer/Profile';
import CustomerDashboard from './pages/customer/Dashboard';
import About from './pages/customer/About';
import CustomerSupport from './pages/customer/CustomerSupport';

// Provider Pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderProfile from './pages/provider/Profile';
import ManageBookings from './pages/provider/ManageBookings';
import ServiceList from './pages/provider/ServiceList';
import AddService from './pages/provider/AddService';
import EditService from './pages/provider/EditService';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminServices from './pages/admin/Services';
import AdminManageBookings from './pages/admin/ManageBookings';
import AdminProfile from './pages/admin/Profile';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/customer-support" element={<CustomerSupport />} />
              <Route path="/login" element={<Login />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route path="/provider/register" element={<ProviderRegister />} />
              
              {/* Customer Protected Routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/customer/bookings" element={
                <ProtectedRoute role="customer">
                  <CustomerBookings />
                </ProtectedRoute>
              } />
              <Route path="/customer/profile" element={
                <ProtectedRoute role="customer">
                  <CustomerProfile />
                </ProtectedRoute>
              } />
              
              {/* Provider Protected Routes */}
              <Route path="/provider/dashboard" element={
                <ProtectedRoute role="provider">
                  <ProviderDashboard />
                </ProtectedRoute>
              } />
              <Route path="/provider/bookings" element={
                <ProtectedRoute role="provider">
                  <ManageBookings />
                </ProtectedRoute>
              } />
              <Route path="/provider/services" element={
                <ProtectedRoute role="provider">
                  <ServiceList />
                </ProtectedRoute>
              } />
              <Route path="/provider/add-service" element={
                <ProtectedRoute role="provider">
                  <AddService />
                </ProtectedRoute>
              } />
              <Route path="/provider/edit-service/:id" element={
                <ProtectedRoute role="provider">
                  <EditService />
                </ProtectedRoute>
              } />
              <Route path="/provider/profile" element={
                <ProtectedRoute role="provider">
                  <ProviderProfile />
                </ProtectedRoute>
              } />
              
              {/* Admin Protected Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute role="admin">
                  <ManageUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedRoute role="admin">
                  <AdminServices />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute role="admin">
                  <AdminManageBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute role="admin">
                  <AdminProfile />
                </ProtectedRoute>
              } />
              
              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
