import React from 'react';

import './styles.css';

class FixtureTime extends React.Component {
  constructor() {
    super();
    this.state = { time: null };
  }

  componentWillMount() {
    const { fixtureTime, currentTime } = this.props;
    const dayDifference = Math.abs(currentTime.getDate() - fixtureTime.getDate());
    if (dayDifference > 1) {
      this.setState(() => ({
        time: `${fixtureTime.toDateString()} at ${fixtureTime.toTimeString()}`
      }))
    } else if (dayDifference === 0) {
      this.setState(() => ({ time: `Today at ${fixtureTime.toTimeString()}` }));
    } else if (dayDifference === 1) {
      this.setState(() => ({ time: `Tomorrow at ${fixtureTime.toTimeString()}` }));
    }
  }

  render() {
    const { time } = this.state;
    return time ? <div className="fixture-time">{time}</div> : <div />;
  }
}

export default FixtureTime;
