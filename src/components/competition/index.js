import React from 'react';

import { fetchCompetition } from '../../api/methods';

import { Link } from 'react-router-dom';

class Competition extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competition: {} };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    fetchCompetition(this.props.match.params.id).then(response => {
      const { data: competition } = response;
      this.setState(() => ({ loading: false, competition }));
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
        <div>
          <Link to={ `/competitions/${this.props.match.params.id}/league-table` }>
            League table
          </Link>
        </div>
      </div>
    );
  }
};

export default Competition;