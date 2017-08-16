import React from 'react';

import './styles.css';

const FixtureMatchWeek = ({ number }) => (
  <div className="fixture-match-week">
    <div className="fixture-match-week-label">
      Week
    </div>
    <div className="fixture-match-week-number">
      { number }
    </div>
  </div>
);

export default FixtureMatchWeek;
