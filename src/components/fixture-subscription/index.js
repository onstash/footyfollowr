import React from 'react';

import { subscribeToNotifications, checkSubscription } from '../../api/methods';
import messaging from '../../utils/firebase';
import Cache from '../../utils/cache';

const firebaseMessaging = messaging();

firebaseMessaging.onMessage(payload => {
  console.log('payload', payload);
  alert(`Reminder: ${payload.notification.title} starts in 5 minutes`);
});

const Toggled = () => (
  <img
    className="fa-fixture-subscription-icon"
    src={require('./notifications-button-toggled.png')} />
);

const Untoggled = () => (
  <img
    className="fa-fixture-subscription-icon"
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
      .catch(error => {
        // alert(JSON.stringify(error));
      });
  }

  onClick() {
    this.setState(() => ({ hasSubscribed: !this.state.hasSubscribed }));
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
