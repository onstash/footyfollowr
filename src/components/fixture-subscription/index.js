import React from 'react';

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
