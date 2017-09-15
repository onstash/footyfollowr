import React from 'react';

const FixtureMatchWeek = ({ number }) => (
  <div className="fa-fixture-match-week">
    <div className="fa-fixture-match-week-label">
      Week
    </div>
    <div className="fa-fixture-match-week-number">
      { number }
    </div>
  </div>
);

export default FixtureMatchWeek;
