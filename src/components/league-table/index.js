import React from 'react';

import { fetchCompetitionLeagueTable } from '../../api/methods';

import { Link } from 'react-router-dom';

class LeagueTable extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competition: {} };
  }

  componentWillMount() {
    const { id } = this.props;
    if (!id) {
      return;
    }

    this.setState(() => ({ loading: true }));
    console.log('this.props', this.props);
    fetchCompetitionLeagueTable().then(response => {
      // const { data: competition } = response;
      console.log('response', response);
      this.setState(() => ({ loading: false }));
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
    console.log('this.props', this.props);
    fetchCompetitionLeagueTable().then(response => {
      // const { data: competition } = response;
      console.log('response', response);
      this.setState(() => ({ loading: false }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('LeagueTable shouldComponentUpdate', this.state !== nextState);
    return this.state !== nextState;
  }

  render() {
    const { id } = this.props;
    if (!id) {
      return <div />;
    }

    const { loading, competition } = this.state;

    if (loading) {
      return <div>Loading</div>;
    }

    if (!competition) {
      return <div>There's something wrong!</div>;
    }

    return <div>Hello</div>;

    const {
      caption,
      league,
      numberOfGames,
      numberOfMatchdays,
      currentMatchday
    } = competition;

    return (
      <div className="container">
        <h2 className="caption">
          { caption }
        </h2>
        <h3 className="games">
          { numberOfGames }
        </h3>
        <h4 className="match-day">
          { currentMatchday } / { numberOfMatchdays }
        </h4>
      </div>
    );
  }
};

export default LeagueTable;