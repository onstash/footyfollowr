import React from 'react';

import DataLayer from '../../data';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

import PlaceholderChampionsLeagueTable from '../placeholder-champions-league-table';

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
  team: teamName,
  goals,
  goalDifference,
  goalsAgainst,
  points
}) => (
  <tr className="fa-league-table-body-row">
    <td data-label="Position" className="fa-position">
      {position}
    </td>
    <td data-label="Team" className="fa-team-name">
      {teamName.replace(' FC', '')}
    </td>
    <td data-label="Goals" className="fa-points">
      {goals}
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

const ChampionsLeagueGroup = ({ standing }) => {
  const groupName = standing[0].group;
  return (
    <div className="fa-champions-league-table-group-container">
      <div className="fa-champions-league-table-group-name">
        {groupName}
      </div>
      <table className="fa-champions-league-table-group">
        <thead className="fa-champions-league-table-head">
          <tr className="fa-champions-league-table-head-row">
            <th className="fa-position" scope="col" />
            <th className="fa-team-name" scope="col">Team</th>
            <th className="fa-points" scope="col">G</th>
            <th className="fa-points" scope="col">GD</th>
            <th className="fa-points" scope="col">GA</th>
            <th className="fa-points" scope="col">P</th>
          </tr>
        </thead>
        <tbody className="fa-champions-league-table-body">
          {
            standing.map((row, index) => <LeagueTableEntry key={index} {...row} position={index+1} />)
          }
        </tbody>
      </table>
    </div>
  );
};

class ChampionsLeagueTable extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      standings: [],
      league: null,
      matchDay: null,
      matchDays: [1]
    };
    this._fetchCompetitionLeagueTableData = this.fetchCompetitionLeagueTableData.bind(this);
    this.mounted = false;
  }

  fetchCompetitionLeagueTableData({competitionID, matchDay, replaceMatchDays}) {
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
          }).catch(e => {});
        const {
          leagueCaption: league,
          standings: _standings,
          matchday: matchDay
        } = response.data;
        const standings = Object.keys(_standings).map(groupName => {
          const standing = _standings[groupName];
          standing.sort(({ points: teamAPoints }, { points: teamBPoints }) => {
            return teamAPoints > teamBPoints ? -1 : 1;
          });
          return standing;
        });
        if (this.mounted) {
          if (replaceMatchDays === true) {
            const matchDays = matchDay > 1 ? range(1, matchDay + 1) : [1];
            this.setState(() => ({
              loading: false,
              league, standings,
              matchDay, matchDays
            }));
          } else {
            this.setState(() => ({
              loading: false,
              league, standings,
              matchDay
            }));
          }
        }
      })
      .catch(error => {
        if (this.mounted) {
          this.setState(() => ({ loading: false, standings: [] }));
        }
      });
  }

  componentDidMount() {
    this.mounted = true;
    const { matchDay } = this.state;
    const { id: competitionID } = this.props;
    this._fetchCompetitionLeagueTableData({
      competitionID,
      matchDay,
      replaceMatchDays: true
    });
  }

  componentWillReceiveProps({ id: newCompetitionID }) {
    const { id: oldCompetitionID } = this.props;
    if (newCompetitionID === oldCompetitionID) {
      return;
    }
    const { matchDay } = this.state;
    this._fetchCompetitionLeagueTableData({
      competitionID: newCompetitionID,
      matchDay,
      replaceMatchDays: false
    });
  }

  handleSelection(event) {
    event.preventDefault();
    const newMatchDay = event.target.value;
    const { id: competitionID } = this.props;
    this._fetchCompetitionLeagueTableData({ competitionID, matchDay: newMatchDay });
  }

  render() {
    const { loading, standings, matchDay, matchDays } = this.state;

    if (loading) {
      return <PlaceholderChampionsLeagueTable />;
    }

    if (standings.length === 0) {
      return <LeagueTableError />;
    }

    const { label } = this.props;

    return (
      <div className="fa-champions-league-table-container">
        <h2 className="fa-champions-league-table-heading">{label}</h2>
        <div className="fa-champions-league-table-match-day">
          <div className="fa-champions-league-table-match-day-label">
           Week:
          </div>
          <div className="fa-champions-league-table-match-day-value">
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
        <div className="fa-champions-league-table-groups">
          {
            standings.map((standing, index) => (
              <ChampionsLeagueGroup
                standing={standing}
                key={index}
              />
            ))
          }
        </div>
      </div>
    );
  }
};

export default ChampionsLeagueTable;
