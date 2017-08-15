import React from 'react';

import DataLayer from '../../data';

import './styles.css';

const range = (start, end) =>
  Array.from({length: (end - start)}, (v, k) => k + start);

const LeagueTableEntry = ({
  position,
  teamName,
  wins,
  losses,
  draws,
  goalDifference,
  goalsAgainst,
  points
}) => {
  return (
    <tr>
      <td data-label="Team" className="name">
        {teamName}
      </td>
      <td data-label="Wins" className="points">
        {wins}
      </td>
      <td data-label="Losses" className="points">
        {losses}
      </td>
      <td data-label="Draws" className="points">
        {draws}
      </td>
      <td data-label="Goal Difference" className="points">
        {goalDifference}
      </td>
      <td data-label="Goals Against" className="points">
        {goalsAgainst}
      </td>
      <td data-label="Points" className="points">
        {points}
      </td>
    </tr>
  );
};

class LeagueTable extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      standing: [],
      league: null,
      matchDay: null,
      matchDays: [1]
    };
  }

  componentDidMount() {
    const { matchDay } = this.state;
    this.setState(() => ({ loading: true }));
    DataLayer.fetchCompetitionLeagueTable(this.props.match.params.id, matchDay)
      .then(response => {
        const { leagueCaption: league, standing, matchday: matchDay } = response.data;
        const matchDays = matchDay > 1 ? range(1, matchDay + 1) : [1];
        this.setState(() => ({ loading: false, league, standing, matchDay, matchDays }));
      }).catch(error => {
        this.setState(() => ({ loading: false }));
      });
  }

  handleSelection(event) {
    event.preventDefault();
    const newMatchDay = event.target.value;
    DataLayer.fetchCompetitionLeagueTable(this.props.match.params.id, newMatchDay)
      .then(response => {
        const { standing } = response.data;
        this.setState(() => ({ loading: false, standing, matchDay: newMatchDay }));
      }).catch(error => {
        this.setState(() => ({ loading: false, matchDay: newMatchDay }));
      });
  }

  render() {
    const { loading, standing, league, matchDay, matchDays } = this.state;

    if (loading) {
      return <div className="league-table-container">Loading</div>;
    }

    return (
      <div className="league-table-container">
        <h2 className="league-table-heading">{league}</h2>
        <div className="league-table-match-day">
          <div className="league-table-match-day-label">
           Match day:
          </div>
          <div className="league-table-match-day-value">
            <select
              value={matchDay}
              onChange={(event) => this.handleSelection(event)}
            >
              {
                matchDays.map((matchDayValue, index) =>
                  <option value={`${matchDayValue}`} key={index}>
                    {matchDayValue}
                  </option>
                )
              }
            </select>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th className="name" scope="col">Team</th>
              <th className="points" scope="col">Wins</th>
              <th className="points" scope="col">Losses</th>
              <th className="points" scope="col">Draws</th>
              <th className="points" scope="col">Goal Difference</th>
              <th className="points" scope="col">Goals Against</th>
              <th className="points" scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {
              standing.map((row, index) => <LeagueTableEntry key={index} {...row} />)
            }
          </tbody>
        </table>
      </div>
    );
  }
};

export default LeagueTable;
