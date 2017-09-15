import React from 'react';

const TimeDifference = ({ label }) => {
  if (!label) {
    return <div />;
  }
  return (
    <div className="fa-time-difference">
      {label}
    </div>
  );
};

export default TimeDifference;
