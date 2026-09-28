import React from 'react';
import { Container } from 'react-bootstrap';

const PageHero = ({ title, subtitle, children, badge }) => {
  return (
    <div className="page-hero">
      <Container className="page-hero-content text-center py-4">
        {badge && (
          <div className="mb-3">
            <span className="badge bg-light text-primary px-3 py-2 text-uppercase fw-bold letter-spacing-1">
              {badge}
            </span>
          </div>
        )}
        <h1 className="fw-bold display-5 mb-3 text-white">{title}</h1>
        {subtitle && (
          <p className="lead mx-auto mb-4 text-white-50" style={{ maxWidth: '650px' }}>
            {subtitle}
          </p>
        )}
        {children}
      </Container>
    </div>
  );
};

export default PageHero;
