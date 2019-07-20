import React from 'react';

import { subscribeToNotifications, checkSubscription } from '../../api/methods';
import messaging from '../../utils/firebase';
import Cache from '../../utils/cache';

import mixpanel from '../../utils/mixpanel';

const firebaseMessaging = messaging();

const Toggled = () => (
  <img
    className="fa-fixture-subscription-icon"
    alt="notifications-button-toggled"
    src={require('./notifications-button-toggled.png')}
  />
);

const Untoggled = () => (
  <img
    className="fa-fixture-subscription-icon"
    alt="notifications-button-untoggled"
    src={require('./notifications-button.png')}
  />
);

const ToggleLoading = () => (
  <div className="fa-fixture-subscription-loading">
    (Loading)
  </div>
);

const Dummy = () => null;

const fetchDistinctIDFromCache = () =>
    Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
        .then(distinctID => distinctID, error => {
            console.log({ source: "fetchDistinctIDFromCache", error });
            return Promise.reject(error);
        });


const trackNotificationToggle = ({ toggleState, home_team: homeTeam, away_team: awayTeam, date, fixture_id: fixtureID }) =>
    fetchDistinctIDFromCache().then(distinctID =>
        mixpanel.track(
            distinctID,
            "Notification Bell Toggled",
            { value: toggleState, homeTeam, awayTeam, date, fixtureID }
        )
    );


const trackNotificationDelivered = ({ appState, title, userConfirmation }) =>
    fetchDistinctIDFromCache().then(distinctID =>
        mixpanel.track(
            distinctID,
            "Push Notification Received",
            { appState, title, userConfirmation }
        )
    );


const trackNotificationPermissionResponse = ({ userResponse }) =>
    fetchDistinctIDFromCache().then(distinctID =>
        mixpanel.track(
            distinctID,
            "Push Notification Permission",
            { granted: userResponse }
        )
    );


const fetchNotificationsPermissionFromUser = () =>
    firebaseMessaging.requestPermission()
        .then(() => {
            trackNotificationPermissionResponse({ userResponse: true });
            return;
        }, error => {
            trackNotificationPermissionResponse({ userResponse: false });
            return Promise.reject(error);
        });

const fetchNotificationsPermissionFromCache = ({ fetchPermission = false }) =>
    Cache.get(Cache.keys.NOTIFICATIONS_PERMISSIONS_REQUESTED)
        .then(fcmToken => fcmToken, error => {
            if (fetchPermission) {
                return fetchNotificationsPermissionFromUser();
            }
            return Promise.reject(error);
        });


class FixtureSubscription extends React.Component {
  constructor() {
    super();
    this.state = { hasSubscribed: false, loading: true };
    this._onClick = this.onClick.bind(this);
    this._onNotificationMessage = this._onNotificationMessage.bind(this);
  }

  componentDidMount() {
    firebaseMessaging.onMessage(this._onNotificationMessage);

    fetchNotificationsPermissionFromCache({ fetchPermission: false })
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
        this.setState(() => ({ loading: false }));
      });
  }

  _onNotificationMessage(payload) {
    if (payload.notification) {
        const title = payload.notification.title;
        const userConfirmation = confirm(`${title}`); // eslint-disable-line no-restricted-globals
        trackNotificationDelivered({ appState: "foreground", title, userConfirmation });
    }
  }

  onClick() {
    const { fixtureID, homeTeamName, awayTeamName, date } = this.props;
    const fixtureData = {
        fixture_id: fixtureID,
        home_team: homeTeamName,
        away_team: awayTeamName,
        date
    };
    fetchNotificationsPermissionFromCache({ fetchPermission: true })
      .then(() => firebaseMessaging.getToken())
      .then(fcmToken => {
        this.setState(() => ({ loading: true }));
        const payload = {
          fcm_token: fcmToken,
          fixture_data: fixtureData
        };
        return subscribeToNotifications(payload);
      })
      .then(({ message }) => {
        if (message === "Fixture subscribed successfully") {
          Cache.set(Cache.keys.NOTIFICATIONS_PERMISSIONS_REQUESTED, true);
          this.setState(() => ({ hasSubscribed: true, loading: false }));
          trackNotificationToggle({ toggleState: true, ...fixtureData });
        } else if (message === "Fixture unsubscribed successfully") {
          this.setState(() => ({ hasSubscribed: false, loading: false }));
          trackNotificationToggle({ toggleState: false, ...fixtureData });
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
