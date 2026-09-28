import React from 'react';
import { Container } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading details...' }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="text-center p-4">
        <div className="ss-spinner mx-auto mb-3"></div>
        <p className="text-muted fw-medium mb-0">{message}</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;
