import React from 'react';

import PlaceholderCompetitionScrollableTabs from '../placeholder-competition-scrollable-tabs';
import PlaceholderCompetitionCard from '../placeholder-competition-card';
import PlaceholderFixtures from '../placeholder-fixtures';

const PlaceholderCompetition = () => (
  <div className="fa-placeholder-competition-container">
    <PlaceholderCompetitionScrollableTabs />
    <PlaceholderCompetitionCard />
    <div className="fa-placeholder-competition-data">
      <PlaceholderFixtures />
    </div>
  </div>
);

export default PlaceholderCompetition;
