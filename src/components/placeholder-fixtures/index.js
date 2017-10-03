import React from 'react';

import PlaceholderFixture from '../placeholder-fixture';

const PlaceholderFixtures = () => (
  <div className="fa-placeholder-fixtures-container">
    <h2 className="fa-placeholder-fixtures-heading">
      Fixtures
    </h2>
    <div className="fa-placeholder-fixtures-filter">
      <div className="fa-placeholder-fixtures-filter-time-frame" />
      <div className="fa-placeholder-fixtures-filter-team" />
    </div>
    <div className="fa-placeholder-fixture-match-week-label-container">
      <div className="fa-placeholder-fixture-match-week-label" />
    </div>
    <div className="fa-placeholder-fixtures-list">
      <PlaceholderFixture />
      <PlaceholderFixture />
      <PlaceholderFixture />
    </div>
  </div>
);

export default PlaceholderFixtures;
