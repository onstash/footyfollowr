import React from 'react';

import DataLayer from '../../data';

import { Link } from 'react-router-dom';
import Loader from '../loader';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

const CompetitionError = () => (
  <h2 className="fa-competition-container">
    There seems to be a problem, Master Wayne.
  </h2>
);

class Competition extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competition: {} };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    DataLayer.fetchCompetition(this.props.match.params.id)
      .then(response => {
        const { data: competition } = response;
        const { caption: name } = competition;
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            mixpanel.track(
              distinctID,
              'Competition Viewed',
              { name, id: this.props.match.params.id }
            );
          }).catch(console.error);
        this.setState(() => ({ loading: false, competition }));
      })
      .catch(error => {
        this.setState(() => ({ loading: false }));
      });
  }

  render() {
    const { loading, competition } = this.state;

    if (loading) {
      return <Loader message="Loading competition..." />;
    }

    if (!competition) {
      return <CompetitionError />;
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
      <div className="fa-competition-container">
        <h2 className="fa-competition-caption">
          { caption }
        </h2>
        <h3 className="fa-competition-games">
          <div className="fa-competition-games-label">Total no. of games to be played:</div>
          <div className="fa-competition-games-value">{ numberOfGames }</div>
        </h3>
        <h4 className="fa-competition-match-day">
          <div className="fa-competition-match-day-label">Match day:</div>
          <div className="fa-competition-match-day-value">
            <div className="fa-competition-current-match-day">
              { currentMatchday }
            </div>
            <div className="fa-competition-divider">/</div>
            <div className="fa-competition-number-of-match-days">
              { numberOfMatchdays }
            </div>
          </div>
        </h4>
        <div className="fa-competition-helper-links">
          <Link
            to={ `/competitions/${id}/teams` }
            className="fa-competition-helper-link">
            Teams
          </Link>
          <Link
            to={ `/competitions/${id}/fixtures` }
            className="fa-competition-helper-link">
            Fixtures
          </Link>
          <Link
            to={ `/competitions/${id}/league-table` }
            className="fa-competition-helper-link">
            League Table
          </Link>
        </div>
      </div>
    );
  }
};

export default Competition;
