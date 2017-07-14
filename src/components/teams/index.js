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

  componentWillMount() {
    const { id } = this.props;
    if (!id) {
      return;
    }
    this.setState(() => ({ loading: true }));
    fetchCompetitionTeams().then(response => {
      // const { data: teamsData } = response;
      // const { teams } = teamsData;
      const { data: { teams } } = response;
      this.setState(() => ({ loading: false, teams }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps;
    if (!id) {
      return;
    }

    this.setState(() => ({ loading: true }));
    fetchCompetitionTeams(id).then(response => {
      // const { data: teamsData } = response;
      // const { teams } = teamsData;
      const { data: { teams } } = response;
      this.setState(() => ({ loading: false, teams }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Teams shouldComponentUpdate', nextState !== this.state, this.props !== nextProps);
    return nextState !== this.state || this.props !== nextProps;
  }

  render() {
    const { id } = this.props;
    if (!id) {
      return <div />;
    }

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