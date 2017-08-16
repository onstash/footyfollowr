import React from 'react';

import './styles.css';

const FixtureTeams = ({ homeTeam, awayTeam }) => (
  <div className="fixture-teams">
    <div className="home-team">
      { homeTeam }
    </div>
    <div className="away-team">
       { awayTeam }
    </div>
  </div>
);

export default FixtureTeams;
