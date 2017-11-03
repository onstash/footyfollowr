import React from 'react';

import { subscribeToNotifications, checkSubscription } from '../../api/methods';
import messaging from '../../utils/firebase';
import Cache from '../../utils/cache';

const firebaseMessaging = messaging();

firebaseMessaging.onMessage(payload => {
  console.log('payload', payload);
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

class FixtureSubscription extends React.Component {
  constructor() {
    super();
    this.state = { hasSubscribed: false };
    this._onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    Cache.get(Cache.keys.NOTIFICATIONS_PERMISSIONS_REQUESTED)
      .then(() => firebaseMessaging.requestPermission())
      .then(() => firebaseMessaging.getToken())
      .then(fcmToken => {
        const { fixtureID } = this.props;
        return checkSubscription({ fixtureID, fcmToken });
      })
      .then(({ has_subscribed: hasSubscribed }) => {
        console.log('hasSubscribed', hasSubscribed);
        this.setState(() => ({ hasSubscribed }));
      })
      .catch(error => {});
  }

  onClick() {
    firebaseMessaging.requestPermission()
      .then(() => {
        return firebaseMessaging.getToken();
      })
      .then(fcmToken => {
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
          this.setState(() => ({ hasSubscribed: true }));
        } else if (message === "Fixture unsubscribed successfully") {
          this.setState(() => ({ hasSubscribed: false }));
        }
      })
      .catch(error => {
        console.log('[firebase] error', error);
      });
  }

  render() {
    const { hasSubscribed } = this.state;
    const SubscriptionComponent = hasSubscribed ? Toggled : Untoggled;
    return (
      <div className="fa-fixture-subscription-container">
        <div className="fa-fixture-subscription" onClick={this._onClick}>
          <SubscriptionComponent />
        </div>
      </div>
    );
  }
}

export default FixtureSubscription;
