import React from 'react';

import DataLayer from '../../data';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

import PlaceholderLeagueTable from '../placeholder-league-table';

const range = (start, end) =>
  Array.from({length: (end - start)}, (v, k) => k + start);

const LeagueTableError = () => (
  <div className="fa-league-table-container">
    <div className="fa-league-table-error">
      The table is not ready, Master Wayne.
    </div>
  </div>
);

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
    <tr className="fa-league-table-body-row">
      <td data-label="Position" className="fa-position">
        {position}
      </td>
      <td data-label="Team" className="fa-team-name">
        {teamName.replace(' FC', '')}
      </td>
      <td data-label="Wins" className="fa-points">
        {wins}
      </td>
      <td data-label="Losses" className="fa-points">
        {losses}
      </td>
      <td data-label="Draws" className="fa-points">
        {draws}
      </td>
      <td data-label="Goal Difference" className="fa-points">
        {goalDifference}
      </td>
      <td data-label="Goals Against" className="fa-points">
        {goalsAgainst}
      </td>
      <td data-label="Points" className="fa-points">
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
    this._fetchCompetitionLeagueTableData = this.fetchCompetitionLeagueTableData.bind(this);
    this.mounted = false;
  }

  fetchCompetitionLeagueTableData({competitionID, matchDay}) {
    if (!competitionID) {
      return;
    }
    if (this.mounted) {
      this.setState(() => ({ loading: true }));
    }
    DataLayer.fetchCompetitionLeagueTable(competitionID, matchDay)
      .then(response => {
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            const eventProperties = {
              id: competitionID,
              name: this.props.name,
              matchDay
            };
            mixpanel.track(
              distinctID,
              'LeagueTable Viewed',
              eventProperties
            );
          }).catch(console.error);
        const {
          leagueCaption: league,
          standing,
          matchday: matchDay
        } = response.data;
        const matchDays = matchDay > 1 ? range(1, matchDay + 1) : [1];
        if (this.mounted) {
          this.setState(() => ({
            loading: false,
            league, standing,
            matchDay, matchDays
          }));
        }
      })
      .catch(error => {
        if (this.mounted) {
          this.setState(() => ({ loading: false, standing: [] }));
        }
      });
  }

  componentDidMount() {
    this.mounted = true;
    const { matchDay } = this.state;
    const { id: competitionID } = this.props;
    this._fetchCompetitionLeagueTableData({ competitionID, matchDay });
  }

  componentWillReceiveProps({ id: newCompetitionID }) {
    const { id: oldCompetitionID } = this.props;
    if (newCompetitionID === oldCompetitionID) {
      return;
    }
    const { matchDay } = this.state;
    this._fetchCompetitionLeagueTableData({ competitionID: newCompetitionID, matchDay });
  }

  handleSelection(event) {
    event.preventDefault();
    const newMatchDay = event.target.value;
    const { id: competitionID } = this.props;
    this._fetchCompetitionLeagueTableData({ competitionID, matchDay: newMatchDay });
  }

  render() {
    const { loading, standing, matchDay, matchDays } = this.state;

    if (loading) {
      return <PlaceholderLeagueTable />;
    }

    if (standing.length === 0) {
      return <LeagueTableError />;
    }

    return (
      <div className="fa-league-table-container">
        <h2 className="fa-league-table-heading">League Table</h2>
        <div className="fa-league-table-match-day">
          <div className="fa-league-table-match-day-label">
           Week:
          </div>
          <div className="fa-league-table-match-day-value">
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
        <table className="fa-league-table">
          <thead className="fa-league-table-head">
            <tr className="fa-league-table-head-row">
              <th className="fa-position" scope="col" />
              <th className="fa-team-name" scope="col">Team</th>
              <th className="fa-points" scope="col">W</th>
              <th className="fa-points" scope="col">L</th>
              <th className="fa-points" scope="col">D</th>
              <th className="fa-points" scope="col">GD</th>
              <th className="fa-points" scope="col">GA</th>
              <th className="fa-points" scope="col">P</th>
            </tr>
          </thead>
          <tbody className="fa-league-table-body">
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
