import React from 'react';

import {
  checkIfOnboardingShown,
  setOnboardingShown
} from '../../utils/onboarding';

import Competitions from '../competitions';

import Cache from '../../utils/cache';
import fetchIPInformation from '../../utils/ip';
import mixpanel from '../../utils/mixpanel';

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
      <div className="fa-onboarding-container">
        <div className="fa-welcome-message">
          Welcome to Footyfollowr
        </div>
        <div className="fa-jumbotron">
          <div className="fa-explanation">
            Follow football leagues without the fuss
          </div>
          <div className="fa-features">
            <div className="fa-features-label">
              Features include:
            </div>
            <div className="fa-features-list">
              <div className="fa-feature">
                Know past, live & upcoming fixtures of your favourite teams
              </div>
              <div className="fa-feature">
                Know league table standings of your favourite teams
              </div>
              <div className="fa-feature">
                Know all the teams playing in the league
              </div>
              <div className="fa-feature">
                Know the current stage of different leagues
              </div>
            </div>
          </div>
          <div
            className="fa-onboarding-button"
            onClick={event => this.handleOnboardingButton(event)}
          >
            AWESOME!
          </div>
        </div>
      </div>
    );
  }
}

export default Onboarding;
