import React from 'react';

import teamLogos from '../../data/team-logos';

import './styles.css';

const FixtureTeams = ({ homeTeam, awayTeam }) => {
  return (
    <div className="fixture-teams">
      <div className="home-team">
        <div className="name">
          { homeTeam }
        </div>
        <img
          src={teamLogos[homeTeam]}
          alt={homeTeam}
          className="crest"
        />
      </div>
      <div className="divider">
        vs
      </div>
      <div className="away-team">
        <div className="name">
          { awayTeam }
        </div>
        <img
          src={teamLogos[awayTeam]}
          alt={homeTeam}
          className="crest"
        />
      </div>
    </div>
  );
};

export default FixtureTeams;
