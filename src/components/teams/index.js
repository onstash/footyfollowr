import React from 'react';

import DataLayer from '../../data';

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
        this.setState(() => ({ loading: false, teams }));
      }).catch(error => {
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

    if (!teams) {
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
