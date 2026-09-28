import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = '🔍',
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionText,
  actionLink,
  onAction
}) => {
  return (
    <div className="empty-state py-5 text-center">
      <div className="empty-state-icon display-3 mb-3">{icon}</div>
      <h4 className="fw-bold text-dark mb-2">{title}</h4>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {actionText && actionLink && (
        <Button as={Link} to={actionLink} variant="primary" className="px-4 py-2">
          {actionText}
        </Button>
      )}
      {actionText && onAction && !actionLink && (
        <Button onClick={onAction} variant="primary" className="px-4 py-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
