import React from 'react';

import DataLayer from '../../data';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

import './styles.css';

const Team = ({ name, crestUrl, shortName }) => (
  <div className="team">
    <img src={crestUrl} className="team-logo" />
    <div className="team-name">
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
        <div className="teams-container">
          <h2 className="teams-heading">
            Loading teams...
          </h2>
        </div>
      );
    }

    if (teams.length === 0) {
      return <div className="teams-container">{"There's something wrong!"}</div>;
    }

    return (
      <div className="teams-container">
        <h2 className="teams-heading">Teams</h2>
        <div className="teams">
          {
            teams.map((team, index) => <Team {...team} key={ index }/>)
          }
        </div>
      </div>
    );
  }
};

export default Teams;
