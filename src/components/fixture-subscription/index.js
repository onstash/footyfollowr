import React from 'react';

import { subscribeToNotifications, checkSubscription } from '../../api/methods';
import messaging from '../../utils/firebase';
import Cache from '../../utils/cache';

const firebaseMessaging = messaging();

firebaseMessaging.onMessage(payload => {
  if (payload.notification) {
    alert(`${payload.notification.title}`);
  }
});

const Toggled = () => (
  <img
    className="fa-fixture-subscription-icon"
    alt="notifications-button-toggled"
    src={require('./notifications-button-toggled.png')} />
);

const Untoggled = () => (
  <img
    className="fa-fixture-subscription-icon"
    alt="notifications-button-untoggled"
    src={require('./notifications-button.png')} />
);

const ToggleLoading = () => (
  <div className="fa-fixture-subscription-loading">
    (Loading)
  </div>
);

const Dummy = () => <div />;

class FixtureSubscription extends React.Component {
  constructor() {
    super();
    this.state = { hasSubscribed: false, loading: true };
    this._onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    Cache.get(Cache.keys.NOTIFICATIONS_PERMISSIONS_REQUESTED)
      .then(() => firebaseMessaging.requestPermission())
      .then(() => firebaseMessaging.getToken())
      .then(fcmToken => {
        const { fixtureID } = this.props;
        this.setState(() => ({ loading: true }));
        return checkSubscription({ fixtureID, fcmToken });
      })
      .then(({ has_subscribed: hasSubscribed }) => {
        this.setState(() => ({ hasSubscribed, loading: false }));
      })
      .catch(error => {
        console.log({ source: "FixtureSubscription", error });
        this.setState(() => ({ loading: false }));
      });
  }

  onClick() {
    firebaseMessaging.requestPermission()
      .then(() => {
        return firebaseMessaging.getToken();
      })
      .then(fcmToken => {
        this.setState(() => ({ loading: true }));
        const { fixtureID, homeTeamName, awayTeamName, date } = this.props;
        const payload = {
          fcm_token: fcmToken,
          fixture_data: {
            fixture_id: fixtureID,
            home_team: homeTeamName,
            away_team: awayTeamName,
            date
          }
        };
        return subscribeToNotifications(payload);
      })
      .then(({ message }) => {
        if (message === "Fixture subscribed successfully") {
          Cache.set(Cache.keys.NOTIFICATIONS_PERMISSIONS_REQUESTED, true);
          this.setState(() => ({ hasSubscribed: true, loading: false }));
        } else if (message === "Fixture unsubscribed successfully") {
          this.setState(() => ({ hasSubscribed: false, loading: false }));
        }
      })
      .catch(error => {
        this.setState(() => ({ loading: false }));
        console.log('[firebase] error', error);
      });
  }

  render() {
    const { hasSubscribed, loading } = this.state;
    const SubscriptionComponent = hasSubscribed ? Toggled : Untoggled;
    const SubscriptionLoadingComponent = loading ? ToggleLoading : Dummy;
    return (
      <div className="fa-fixture-subscription-container">
        <div className="fa-fixture-subscription-icon-container">
          <div className="fa-fixture-subscription" onClick={this._onClick}>
            <SubscriptionComponent />
          </div>
          <SubscriptionLoadingComponent />
        </div>
      </div>
    );
  }
}

export default FixtureSubscription;
