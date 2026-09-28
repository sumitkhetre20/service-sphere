import React from 'react';

const SkeletonCard = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 border-0 shadow-sm p-0 overflow-hidden">
            <div className="skeleton skeleton-img w-100" style={{ height: '200px' }}></div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="skeleton skeleton-title mb-0" style={{ width: '60%' }}></div>
                <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '12px' }}></div>
              </div>
              <div className="skeleton skeleton-text" style={{ width: '90%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '75%' }}></div>
              <div className="d-flex justify-content-between align-items-center mt-4 pt-2 border-top">
                <div className="skeleton" style={{ width: '80px', height: '18px' }}></div>
                <div className="skeleton skeleton-btn" style={{ width: '100px', height: '32px' }}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
