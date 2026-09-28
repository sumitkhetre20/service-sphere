import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, totalReviews, interactive = false, onRate, size = 16 }) => {
  const stars = [];
  const rounded = Math.round((rating || 0) * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      stars.push(
        <FaStar
          key={i}
          size={size}
          className="star filled"
          style={{ color: '#f59e0b', cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onRate && onRate(i)}
        />
      );
    } else if (i - 0.5 === rounded) {
      stars.push(
        <FaStarHalfAlt
          key={i}
          size={size}
          className="star half"
          style={{ color: '#f59e0b', cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onRate && onRate(i)}
        />
      );
    } else {
      stars.push(
        <FaRegStar
          key={i}
          size={size}
          className="star"
          style={{ color: '#d1d5db', cursor: interactive ? 'pointer' : 'default' }}
          onClick={() => interactive && onRate && onRate(i)}
        />
      );
    }
  }

  return (
    <div className={`star-rating ${interactive ? '' : 'display-only'} d-inline-flex align-items-center gap-1`}>
      <div className="d-inline-flex align-items-center">{stars}</div>
      {typeof totalReviews !== 'undefined' && (
        <span className="text-muted ms-1 small fw-semibold">({totalReviews})</span>
      )}
    </div>
  );
};

export default StarRating;
