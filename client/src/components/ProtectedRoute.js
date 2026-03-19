import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <h3>Access Denied</h3>
          <p>You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (!user?.isApproved && user?.role !== 'customer') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <h3>Account Pending Approval</h3>
          <p>Your account is pending approval from the administrator.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
