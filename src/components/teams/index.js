import React from 'react';

import DataLayer from '../../data';
import Loader from '../loader';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

import teamLogos from '../../data/team-logos';


const Team = ({ name, crestUrl, shortName }) => (
  <div className="fa-team">
    <img src={teamLogos[name] || crestUrl} className="fa-team-logo" />
    <div className="fa-team-name">
      { name }
    </div>
  </div>
);

class Teams extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, teams: [] };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    DataLayer.fetchCompetitionTeams(this.props.match.params.id)
      .then(response => {
        const { data: { teams } } = response;
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            const eventProperties = {
              id: this.props.match.params.id,
              teams: teams.length
            };
            mixpanel.track(
              distinctID,
              'Teams Viewed',
              eventProperties
            );
          }).catch(console.error);
        this.setState(() => ({ loading: false, teams }));
      })
    .catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  render() {
    const { loading, teams } = this.state;

    if (loading) {
      return (
        <div className="fa-teams-container">
          <h2 className="fa-teams-heading">
            Loading teams...
          </h2>
        </div>
      );
    }

    if (teams.length === 0) {
      return <div className="fa-teams-container">{"There's something wrong!"}</div>;
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
