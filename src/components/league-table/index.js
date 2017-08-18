import React from 'react';

import DataLayer from '../../data';

import './styles.css';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

const range = (start, end) =>
  Array.from({length: (end - start)}, (v, k) => k + start);

const LeagueTableError = () => (
  <div className="league-table-container">
    <h2 className="league-table-heading">
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
    <tr>
      <td data-label="Position" className="position">
        {position}
      </td>
      <td data-label="Team" className="teamname">
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
      return (
        <div className="league-table-container">
          <h2 className="league-table-heading">
            Loading table...
          </h2>
        </div>
      );
    }

    if (standing.length === 0) {
      return <LeagueTableError />;
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
              <th className="position" scope="col" />
              <th className="teamname" scope="col">Team</th>
              <th className="points" scope="col">W</th>
              <th className="points" scope="col">L</th>
              <th className="points" scope="col">D</th>
              <th className="points" scope="col">GD</th>
              <th className="points" scope="col">GA</th>
              <th className="points" scope="col">P</th>
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
