import React from 'react';

import { fetchCompetitionTeams } from '../../api/methods';

import { Link } from 'react-router-dom';

const Team = ({ name, shortName }) => (
  <div className="container">
    <h2 className="name">
      { name }
    </h2>
    <h2 className="short-name">
      { shortName }
    </h2>
  </div>
);

class Teams extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, teams: [] };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    fetchCompetitionTeams(this.props.match.params.id).then(response => {
      const { data: teamsData } = response;
      const { teams } = teamsData;
      this.setState(() => ({ loading: false, teams }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  render() {
    const { loading, teams } = this.state;

    if (loading) {
      return <div>Loading</div>;
    }

    if (!teams) {
      return <div>There's something wrong!</div>;
    }

    return (
      <div>
        {
          teams.map((team, index) => <Team {...team} key={ index }/>)
        }
      </div>
    );
  }
};

export default Teams;