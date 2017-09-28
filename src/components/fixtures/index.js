import React from 'react';

import DataLayer from '../../data';

import DayFixtures from '../day-fixtures';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

import Loader from '../loader';

const FixturesListError = () => (
  <div className="fa-fixtures-error">
    No fixtures for selected time period, Master Wayne.
  </div>
);

const FixturesList = ({ fixtures, timeFrame, team, dayFixtures }) => {
  if (Object.keys(fixtures).length === 0) {
    return <FixturesListError />;
  }
  return (
    <div className="fa-fixtures">
      {
        Object.keys(fixtures).map(fixtureDay => {
          const dayFixtures = fixtures[fixtureDay];
          return (
            <DayFixtures
              key={fixtureDay}
              timeFrame={timeFrame}
              team={team}
              fixtureDay={fixtureDay}
              fixtures={dayFixtures}
            />
          );
        })
      }
    </div>
  );
};

const collateFixtures = fixtures => {
  const oldFixtures = {};
  const upcomingFixtures = {};
  fixtures.forEach(fixture => {
    const { matchday: matchDay, status } = fixture;
    const target = status === 'FINISHED' ? oldFixtures : upcomingFixtures;
    if (target[matchDay]) {
      target[matchDay].push(fixture)
    } else {
      target[matchDay] = [fixture];
    }
  });
  return { oldFixtures, upcomingFixtures };
};

class Fixtures extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      oldFixtures: {},
      upcomingFixtures: {},
      timeFrame: 'n7',
      timeFrameLabel: 'Next week',
      fixtureFilters: [
        { label: 'Next week', timeFrame: 'n7' },
        { label: 'Next 2 weeks', timeFrame: 'n14' },
        { label: 'Previous week', timeFrame: 'p7' }
      ],
      allTeams: {},
      teams: [],
      team: null,
      teamID: null
    };
  }

  componentDidMount() {
    const { timeFrame, team } = this.state;
    this.setState(() => ({ loading: true }));
    const competitionFixturesPromise = DataLayer.fetchCompetitionFixtures(
      this.props.match.params.id, timeFrame
    );
    const competitionTeamsPromise = DataLayer.fetchCompetitionTeams(
      this.props.match.params.id
    );
    Promise.all([
      competitionFixturesPromise,
      competitionTeamsPromise
    ])
      .then(([fixturesResponse, teamsResponse]) => {
        const { data: { teams: teamsList } } = teamsResponse;
        const allTeams = {};
        const teams = [{ label: 'All teams', value: 'all-teams' }];
        teamsList.forEach(team => {
          const { name, _links: { self: { href: teamLink } } } = team;
          const teamLinkParts = teamLink.split('/');
          const teamID = teamLinkParts[teamLinkParts.length - 1];
          allTeams[`${teamID}`] = name;
          teams.push({ label: name, value: teamID });
        });
        const { data: fixturesData } = fixturesResponse;
        const { fixtures } = fixturesData;
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            const eventProperties = {
              id: this.props.match.params.id,
              timeFrame,
              currentTeam: team || 'All Teams',
            };
            mixpanel.track(
              distinctID,
              'Fixtures Viewed',
              eventProperties
            );
          }).catch(console.error)
        const { oldFixtures, upcomingFixtures } = collateFixtures(fixtures);
        this.setState(() => ({
          loading: false,
          oldFixtures,
          upcomingFixtures,
          teams,
          allTeams
        }));
      }).catch(error => {
        this.setState(() => ({ loading: false }));
      });
  }

  handleTimeFrameSelection(event) {
    event.preventDefault();
    const newTimeFrame = event.target.value;
    let timeFrameLabel;
    switch (newTimeFrame) {
      case 'p7':
        timeFrameLabel = 'Previous week';
        break;
      case 'n14':
        timeFrameLabel = 'Next 2 weeks';
        break;
      default:
        timeFrameLabel = 'Next week';
        break;
    }
    const { timeFrame: oldTimeFrame, teamID, allTeams } = this.state;
    if (newTimeFrame === oldTimeFrame) {
      return;
    }

    DataLayer.fetchCompetitionFixtures(
      this.props.match.params.id, newTimeFrame
    ).then(response => {
      const { data: fixturesData } = response;
      const { fixtures } = fixturesData;
      const { team } = this.state;
      Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
        .then(distinctID => {
          const eventProperties = {
            id: this.props.match.params.id,
            timeFrame: newTimeFrame,
            currentTeam: team || 'All Teams',
            filter: 'TimeFrame'
          };
          mixpanel.track(
            distinctID,
            'Fixtures Filtered',
            eventProperties
          );
        }).catch(console.error);
      const { oldFixtures, upcomingFixtures } = collateFixtures(fixtures);
      this.setState(() => ({
        loading: false,
        oldFixtures,
        upcomingFixtures,
        timeFrame: newTimeFrame,
        timeFrameLabel
      }));
    }).catch(error => {
      this.setState(() => ({
        loading: false,
        timeFrame: newTimeFrame,
        timeFrameLabel
      }));
    });
  }

  handleTeamSelection(event) {
    event.preventDefault();
    const teamID = event.target.value;
    const { team, allTeams, timeFrame } = this.state;
    const selectedTeam = allTeams[teamID];
    if (team === selectedTeam) {
      return;
    }
    Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
      .then(distinctID => {
        const { timeFrame } = this.state;
        const eventProperties = {
          id: this.props.match.params.id,
          timeFrame,
          currentTeam: selectedTeam || 'All Teams',
          filter: 'Team'
        };
        mixpanel.track(
          distinctID,
          'Fixtures Filtered',
          eventProperties
        );
      }).catch(console.error);
    this.setState(() => ({ team: selectedTeam }));
  }

  render() {
    const {
      loading,
      upcomingFixtures,
      oldFixtures,
      timeFrame,
      timeFrameLabel,
      fixtureFilters,
      teams,
      team
    } = this.state;

    if (loading) {
      return <Loader message="Loading league fixtures..." />;
    }

    const fixtures = timeFrame.indexOf('n') === -1 ? oldFixtures : upcomingFixtures;

    return (
      <div className="fa-fixtures-container">
        <h2 className="fa-fixtures-heading">
          Fixtures
        </h2>
        <div className="fa-fixtures-filter">
          <select
            onChange={(event) => this.handleTimeFrameSelection(event)}
          >
            {
              fixtureFilters.map(({ label, timeFrame: value }, index) =>
                <option value={value} key={index}>
                  {label}
                </option>
              )
            }
          </select>
          <select
            onChange={(event) => this.handleTeamSelection(event)}
          >
            {
              teams.map(({ label, value }, index) =>
                <option value={value} key={index}>
                  {label}
                </option>
              )
            }
          </select>
        </div>
        <FixturesList
          fixtures={fixtures}
          timeFrame={timeFrame}
          team={team}
          dayFixtures
        />
      </div>
    );
  }
};

export default Fixtures;
