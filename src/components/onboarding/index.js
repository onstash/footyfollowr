import React from 'react';

import {
  checkIfOnboardingShown,
  setOnboardingShown
} from '../../utils/onboarding';

import Competitions from '../competitions';

import Cache from '../../utils/cache';
import fetchIPInformation from '../../utils/ip';
import mixpanel from '../../utils/mixpanel';

import './styles.css';

class Onboarding extends React.Component {
  constructor() {
    super();
    this.state = { onboardingShown: null };
  }

  componentWillMount() {
    checkIfOnboardingShown().then(onboardingShown => {
      this.setState(() => ({ onboardingShown }));
      if (!onboardingShown) {
        setOnboardingShown();
      }
      const onFetchIPSuccess = ({ data: { ip: distinctID } }) =>
        Cache.set(Cache.keys.MIXPANEL_DISTINCT_ID, distinctID);
      const onFetchIPFailure = () => {};
      fetchIPInformation().then(onFetchIPSuccess, onFetchIPFailure);
    });
  }

  handleOnboardingButton(event) {
    event.preventDefault();
    this.setState(() => ({ onboardingShown: true }));
    const onCacheFetchSuccess = distinctID => distinctID;
    const onCacheFetchFailure = () => {};
    Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
      .then(onCacheFetchSuccess, onCacheFetchFailure)
      .then(distinctID => mixpanel.track(distinctID, 'Onboarding Shown'));
  }

  render() {
    const { onboardingShown } = this.state;
    if (onboardingShown) {
      return <Competitions />;
    }

    return (
      <div className="onboarding-container">
        <div className="welcome-message">
          Welcome to MyFootballApp
        </div>
        <div className="jumbotron">
          <div className="explanation">
            A simple app to track different Football leagues such as
            English Premier League, Serie A, Ligue 1, Bundesliga etc.
          </div>
          <div className="features">
            <div className="features-label">
              Features include:
            </div>
            <div className="features-list">
              <div className="feature">
                View upcoming (and past) fixtures in the league
              </div>
              <div className="feature">
                View fixtures for your favourite team
              </div>
              <div className="feature">
                View league table standings
              </div>
              <div className="feature">
                View league table standings for specific match days
              </div>
              <div className="feature">
                View list of teams in the league
              </div>
              <div className="feature">
                View total number of games in the league
              </div>
            </div>
          </div>
          <div
            className="onboarding-button"
            onClick={event => this.handleOnboardingButton(event)}
          >
            OKAY, GREAT!
          </div>
        </div>
      </div>
    );
  }
}

export default Onboarding;
