import React from 'react';

const PlaceholderLeagueTableRow = () => (
  <tr className="fa-placeholder-league-table-body-row">
    <td data-label="Position" className="fa-placeholder-position" />
    <td data-label="Team" className="fa-placeholder-team-name" />
    <td data-label="Wins" className="fa-placeholder-points" />
    <td data-label="Losses" className="fa-placeholder-points" />
    <td data-label="Draws" className="fa-placeholder-points" />
    <td data-label="Goal Difference" className="fa-placeholder-points" />
    <td data-label="Goals Against" className="fa-placeholder-points" />
    <td data-label="Points" className="fa-placeholder-points" />
  </tr>
);

const PlaceholderLeagueTable = () => (
  <div className="fa-placeholder-league-table-container">
    <h2 className="fa-placeholder-league-table-heading">League Table</h2>
    <div className="fa-placeholder-league-table-match-day">
      <div className="fa-placeholder-league-table-match-day-label" />
      <div className="fa-placeholder-league-table-match-day-value" />
    </div>
    <table className="fa-placeholder-league-table">
      <thead className="fa-placeholder-league-table-head">
        <tr className="fa-placeholder-league-table-head-row">
          <th className="fa-placeholder-position-label" scope="col" />
          <th className="fa-placeholder-team-name-label" scope="col">Team</th>
          <th className="fa-placeholder-points-label" scope="col">W</th>
          <th className="fa-placeholder-points-label" scope="col">L</th>
          <th className="fa-placeholder-points-label" scope="col">D</th>
          <th className="fa-placeholder-points-label" scope="col">GD</th>
          <th className="fa-placeholder-points-label" scope="col">GA</th>
          <th className="fa-placeholder-points-label" scope="col">P</th>
        </tr>
      </thead>
      <tbody className="fa-placeholder-league-table-body">
        <PlaceholderLeagueTableRow />
        <PlaceholderLeagueTableRow />
        <PlaceholderLeagueTableRow />
        <PlaceholderLeagueTableRow />
        <PlaceholderLeagueTableRow />
      </tbody>
    </table>
  </div>
);

export default PlaceholderLeagueTable;
