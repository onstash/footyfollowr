import React from 'react';

const PlaceholderTeam = () => (
  <div className="fa-placeholder-team">
    <div className="fa-placeholder-team-logo" />
    <div className="fa-placeholder-team-name" />
  </div>
);

const PlaceholderTeams = () => (
  <div className="fa-placeholder-teams-container">
    <h2 className="fa-placeholder-teams-heading">Teams</h2>
    <div className="fa-placeholder-teams">
      <PlaceholderTeam />
      <PlaceholderTeam />
      <PlaceholderTeam />
      <PlaceholderTeam />
      <PlaceholderTeam />
      <PlaceholderTeam />
      <PlaceholderTeam />
    </div>
  </div>
);

export default PlaceholderTeams;
