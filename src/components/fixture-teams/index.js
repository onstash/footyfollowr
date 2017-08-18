import React from 'react';

import teamLogos from '../../data/team-logos';

import './styles.css';

const FixtureTeams = ({ homeTeam, awayTeam }) => {
  return (
    <div className="fixture-teams">
      <div className="home-team">
        <img
          src={teamLogos[homeTeam]}
          alt={homeTeam}
          className="crest"
        />
        <div className="name">
          { homeTeam }
        </div>
      </div>
      <div className="divider">
        vs
      </div>
      <div className="away-team">
        <img
          src={teamLogos[awayTeam]}
          alt={homeTeam}
          className="crest"
        />
        <div className="name">
          { awayTeam }
        </div>
      </div>
    </div>
  );
};

export default FixtureTeams;
