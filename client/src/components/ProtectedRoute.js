import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button } from 'react-bootstrap';
import { FaShieldAlt, FaClock, FaArrowLeft } from 'react-icons/fa';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Container className="py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card className="text-center p-4 border-0 shadow-lg" style={{ maxWidth: '480px' }}>
          <div className="mx-auto mb-3 p-3 rounded-circle bg-danger-soft text-danger d-inline-flex">
            <FaShieldAlt size={36} />
          </div>
          <h3 className="fw-bold mb-2">Access Restricted</h3>
          <p className="text-muted mb-4">
            You don't have the appropriate permissions to view this section.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button as={Link} to="/" variant="primary" className="d-inline-flex align-items-center gap-2">
              <FaArrowLeft size={12} /> Return Home
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  if (!user?.isApproved && user?.role !== 'customer') {
    return (
      <Container className="py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card className="text-center p-4 border-0 shadow-lg" style={{ maxWidth: '520px' }}>
          <div className="mx-auto mb-3 p-3 rounded-circle bg-warning-soft text-warning d-inline-flex">
            <FaClock size={36} />
          </div>
          <h3 className="fw-bold mb-2">Verification Under Review</h3>
          <p className="text-muted mb-4">
            Thank you for registering with Service Sphere! Your service provider account is currently pending approval by the administration team. You will have full access once approved.
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button as={Link} to="/" variant="outline-primary">
              Back to Home
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
