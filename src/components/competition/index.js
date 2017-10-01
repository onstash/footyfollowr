import React from 'react';

import DataLayer from '../../data';

import PlaceholderCompetition from '../placeholder-competition';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

const CompetitionError = () => (
  <div className="fa-competition-container">
    <div className="fa-competition-caption">
      There seems to be a problem, Master Wayne.
    </div>
  </div>
);

class Competition extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competition: {}, competitionID: null };
    this._fetchCompetitionData = this.fetchCompetitionData.bind(this);
    this.mounted = false;
  }

  fetchCompetitionData(competitionID) {
    if (!competitionID) {
      return;
    }
    if (this.mounted) {
      this.setState(() => ({ loading: true }));
    }
    DataLayer.fetchCompetition(competitionID)
      .then(response => {
        const { data: competition } = response;
        const { caption: name } = competition;
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            mixpanel.track(
              distinctID,
              'Competition Viewed',
              { name, id: competitionID }
            );
          }).catch(console.error);
        if (this.mounted) {
          this.setState(() => ({ loading: false, competition, competitionID }));
        }
      })
      .catch(error => {
        if (this.mounted) {
          this.setState(() => ({ loading: false, competition: {}, competitionID }));
        }
      });
  }

  componentDidMount() {
    this.mounted = true;
    const { id: competitionID } = this.props;
    this._fetchCompetitionData(competitionID);
  }

  componentWillReceiveProps({ id: newCompetitionID }) {
    const { id: oldCompetitionID } = this.props;
    if (newCompetitionID === oldCompetitionID) {
      return;
    }
    this._fetchCompetitionData(newCompetitionID);
  }

  render() {
    const { loading, competition } = this.state;
    if (loading) {
      return <PlaceholderCompetition />;
    }

    const {
      caption,
      numberOfGames,
      numberOfMatchdays,
      currentMatchday
    } = competition;

    if (!competition || !numberOfGames || !numberOfMatchdays || !currentMatchday) {
      return <CompetitionError />;
    }

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
      </div>
    );
  }
};

export default Competition;
