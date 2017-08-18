import React from 'react';

import './styles.css';

const TimeDifference = ({ label }) => {
  if (!label) {
    return <div />;
  }
  return (
    <div className="time-difference">
      ({label})
    </div>
  );
};

export default TimeDifference;
