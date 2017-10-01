import React from 'react';

import DataLayer from '../../data';
import PlaceholderTeams from '../placeholder-teams';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

import teamLogos from '../../data/team-logos';


const Team = ({ name, crestUrl, shortName }) => (
  <div className="fa-team">
    <img src={teamLogos[name] || crestUrl} className="fa-team-logo" alt={name.replace(' FC', '')} />
    <div className="fa-team-name">
      { name.replace(' FC', '') }
    </div>
  </div>
);

class Teams extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, teams: [] };
    this._fetchCompetitionTeamsData = this.fetchCompetitionTeamsData.bind(this);
    this.mounted = false;
  }

  fetchCompetitionTeamsData(competitionID) {
    if (!competitionID) {
      return;
    }
    if (this.mounted) {
      this.setState(() => ({ loading: true }));
    }
    DataLayer.fetchCompetitionTeams(competitionID)
      .then(response => {
        const { data: { teams } } = response;
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            const eventProperties = {
              id: competitionID,
              name: this.props.name,
              teams: teams.length
            };
            mixpanel.track(
              distinctID,
              'Teams Viewed',
              eventProperties
            );
          }).catch(console.error);
        if (this.mounted) {
          this.setState(() => ({ loading: false, teams }));
        }
      })
    .catch(error => {
      if (this.mounted) {
        this.setState(() => ({ loading: false, teams: [] }));
      }
    });
  }

  componentDidMount() {
    this.mounted = true;
    const { id: competitionID } = this.props;
    this._fetchCompetitionTeamsData(competitionID);
  }

  componentWillReceiveProps({ id: newCompetitionID }) {
    this._fetchCompetitionTeamsData(newCompetitionID);
  }

  render() {
    const { loading, teams } = this.state;

    if (loading) {
      return <PlaceholderTeams />;
    }

    if (teams.length === 0) {
      return (
        <div className="fa-teams-container">
          <h2 className="fa-teams-heading">
            {"It seems like there are no teams playing, Master Wayne."}
          </h2>
        </div>
      );
    }

    return (
      <div className="fa-teams-container">
        <h2 className="fa-teams-heading">Teams</h2>
        <div className="fa-teams">
          {
            teams.map((team, index) => <Team {...team} key={ index }/>)
          }
        </div>
      </div>
    );
  }
};

export default Teams;
