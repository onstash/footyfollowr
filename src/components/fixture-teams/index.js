import React from 'react';

import teamLogos from '../../data/team-logos';

const FixtureTeams = ({ homeTeam, awayTeam }) => {
  return (
    <div className="fa-fixture-teams">
      <div className="fa-home-team">
        <img
          src={teamLogos[homeTeam]}
          alt={homeTeam.replace(' FC', '')}
          className="fa-team-crest"
        />
        <div className="fa-name">
          { homeTeam.replace(' FC', '') }
        </div>
      </div>
      <div className="fa-divider">
        vs
      </div>
      <div className="fa-away-team">
        <img
          src={teamLogos[awayTeam]}
          alt={awayTeam.replace(' FC', '')}
          className="fa-team-crest"
        />
        <div className="fa-name">
          { awayTeam.replace(' FC', '') }
        </div>
      </div>
    </div>
  );
};

export default FixtureTeams;
