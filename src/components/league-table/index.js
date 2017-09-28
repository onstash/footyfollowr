import React from 'react';

import DataLayer from '../../data';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

import Loader from '../loader';

const range = (start, end) =>
  Array.from({length: (end - start)}, (v, k) => k + start);

const LeagueTableError = () => (
  <div className="fa-league-table-container">
    <h2 className="fa-league-table-heading">
      {"The table isn't ready, Master Wayne."}
    </h2>
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
  }

  componentDidMount() {
    const { matchDay } = this.state;
    this.setState(() => ({ loading: true }));
    DataLayer.fetchCompetitionLeagueTable(
      this.props.match.params.id, matchDay
    ).then(response => {
      Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
        .then(distinctID => {
          const eventProperties = {
            id: this.props.match.params.id,
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
      this.setState(() => ({
        loading: false,
        league, standing,
        matchDay, matchDays
      }));
    })
    .catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  handleSelection(event) {
    event.preventDefault();
    const newMatchDay = event.target.value;
    DataLayer.fetchCompetitionLeagueTable(
      this.props.match.params.id, newMatchDay
    ).then(response => {
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            const eventProperties = {
              id: this.props.match.params.id,
              matchDay: newMatchDay
            };
            mixpanel.track(
              distinctID,
              'LeagueTable Viewed',
              eventProperties
            );
          }).catch(console.error);
        const { standing } = response.data;
        this.setState(() => ({ loading: false, standing, matchDay: newMatchDay }));
      }).catch(error => {
        this.setState(() => ({ loading: false, matchDay: newMatchDay }));
      });
  }

  render() {
    const { loading, standing, league, matchDay, matchDays } = this.state;

    if (loading) {
      return <Loader message="Loading league standings..." />;
    }

    if (standing.length === 0) {
      return <LeagueTableError />;
    }

    return (
      <div className="fa-league-table-container">
        <h2 className="fa-league-table-heading">{league}</h2>
        <div className="fa-league-table-match-day">
          <div className="fa-league-table-match-day-label">
           Match day:
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
