import React from 'react';

import { fetchCompetition } from '../../api/methods';

import { Link } from 'react-router-dom';

import './styles.css';

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
      return (
        <div className="competition-container">
          <h2 className="caption">
            Loading competition...
          </h2>
        </div>
      );
    }

    if (!competition) {
      return <div>{"There's something wrong!"}</div>;
    }

    const {
      caption,
      league,
      numberOfGames,
      numberOfMatchdays,
      currentMatchday
    } = competition;

    const { id } = this.props.match.params;

    return (
      <div className="competition-container">
        <h2 className="caption">
          { caption }
        </h2>
        <h3 className="games">
          <div className="games-label">Number of games:</div>
          <div className="games-value">{ numberOfGames }</div>
        </h3>
        <h4 className="match-day">
          <div className="match-day-label">Match day:</div>
          <div className="match-day-value">
            <div className="current-match-day">
              { currentMatchday }
            </div>
            <div className="divider">/</div>
            <div className="number-of-match-days">
              { numberOfMatchdays }
            </div>
          </div>
        </h4>
        <div className="competition-links">
          <Link to={ `/competitions/${id}/teams` } className="link-container">
            <div className="link">Teams</div>
          </Link>
          <Link to={ `/competitions/${id}/fixtures` } className="link-container">
            <div className="link">Fixtures</div>
          </Link>
          <Link to={ `/competitions/${id}/league-table` } className="link-container">
            <div className="link">League Table</div>
          </Link>
        </div>
      </div>
    );
  }
};

export default Competition;
