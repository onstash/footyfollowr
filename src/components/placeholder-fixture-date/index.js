import React from 'react';

import PlaceholderFixtureTime from '../placeholder-fixture-time';
import PlaceholderTimeDifference from '../placeholder-time-difference';

const PlaceholderFixtureDate = () => (
  <div className="fa-placeholder-fixture-date">
    <PlaceholderFixtureTime />
    <PlaceholderTimeDifference />
  </div>
);

export default PlaceholderFixtureDate;
