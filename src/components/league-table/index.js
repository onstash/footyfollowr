import React from 'react';

import { fetchCompetitionLeagueTable } from '../../api/methods';

import { Link } from 'react-router-dom';

class LeagueTable extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competition: {} };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    console.log('this.props', this.props);
    fetchCompetitionLeagueTable(this.props.match.params.id).then(response => {
      // const { data: competition } = response;
      console.log('response', response);
      this.setState(() => ({ loading: false }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  render() {
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
        <div>
          <Link to={ `/competitions/${this.props.match.params.id}/teams` }>
            Teams
          </Link>
        </div>
        <div>
          <Link to={ `/competitions/${this.props.match.params.id}/fixtures` }>
            Fixtures
          </Link>
        </div>
      </div>
    );
  }
};

export default LeagueTable;