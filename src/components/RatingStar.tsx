import React from 'react';
//@ts-ignore
import ReactStars from 'react-rating-stars-component';

const firstExample = {
  size: 40,
  value: 0,
  color: 'black',
  isHalf: true,
};

export default function RatingStar({ onStarChange }: { onStarChange: () => void }) {
  return <ReactStars {...firstExample} onChange={onStarChange} />;
}
