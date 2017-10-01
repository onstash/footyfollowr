import React from 'react';

import PlaceholderFixtureDate from '../placeholder-fixture-date';
import PlaceholderFixtureTeams from '../placeholder-fixture-teams';

const PlaceholderFixture = () => (
  <div className="fa-placeholder-fixture-container">
    <PlaceholderFixtureTeams />
    <PlaceholderFixtureDate />
  </div>
);

export default PlaceholderFixture;
