import React from 'react';
import ReactStars from 'react-rating-stars-component';

const firstExample = {
  size: 40,
  value: 0,
  color: 'black',
  isHalf: true,
};

export default function RatingStar({ onStarChange }) {
  return (
      <ReactStars {...firstExample} onChange={onStarChange} />
  );
}
