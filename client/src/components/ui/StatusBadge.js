import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const normalized = status.toLowerCase();

  return (
    <span className={`status-badge ${normalized}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
