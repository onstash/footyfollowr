import React from 'react';

const PlaceholderChampionsLeagueTableRow = () => (
  <tr className="fa-league-table-body-row">
    <td data-label="Position" className="fa-placeholder-position" />
    <td data-label="Team" className="fa-placeholder-table-team-name" />
    <td data-label="Goals" className="fa-placeholder-points" />
    <td data-label="Goal Difference" className="fa-placeholder-points" />
    <td data-label="Goals Against" className="fa-placeholder-points" />
    <td data-label="Points" className="fa-placeholder-points" />
  </tr>
);

const PlaceholderChampionsLeagueGroup = () => (
  <div className="fa-placeholder-champions-league-table-group-container">
    <div className="fa-placeholder-champions-league-table-group-name" />
    <table className="fa-placeholder-champions-league-table-group">
      <thead className="fa-placeholder-champions-league-table-head">
        <tr className="fa-placeholder-champions-league-table-head-row">
          <th className="fa-placeholder-position-label" scope="col" />
          <th className="fa-placeholder-table-team-name-label" scope="col">Team</th>
          <th className="fa-placeholder-points-label" scope="col">G</th>
          <th className="fa-placeholder-points-label" scope="col">GD</th>
          <th className="fa-placeholder-points-label" scope="col">GA</th>
          <th className="fa-placeholder-points-label" scope="col">P</th>
        </tr>
      </thead>
      <tbody className="fa-placeholder-champions-league-table-body">
        <PlaceholderChampionsLeagueTableRow />
        <PlaceholderChampionsLeagueTableRow />
        <PlaceholderChampionsLeagueTableRow />
        <PlaceholderChampionsLeagueTableRow />
      </tbody>
    </table>
  </div>
);

const PlaceholderChampionsLeagueTable = () => (
  <div className="fa-placeholder-champions-league-table-container">
    <h2 className="fa-placeholder-champions-league-table-heading">Champions League Table</h2>
    <div className="fa-placeholder-champions-league-table-match-day">
      <div className="fa-placeholder-champions-league-table-match-day-label" />
      <div className="fa-placeholder-champions-league-table-match-day-value" />
    </div>
    <div className="fa-placeholder-champions-league-table-groups">
      <PlaceholderChampionsLeagueGroup />
      <PlaceholderChampionsLeagueGroup />
      <PlaceholderChampionsLeagueGroup />
      <PlaceholderChampionsLeagueGroup />
    </div>
  </div>
);

export default PlaceholderChampionsLeagueTable;
