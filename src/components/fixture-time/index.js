import React from 'react';

import generateDateString from '../../utils/date';

class FixtureTime extends React.Component {
  constructor() {
    super();
    this.state = { time: null };
  }

  componentWillMount() {
    const { fixtureTime, currentTime } = this.props;
    const dayDifference = currentTime.getDate() - fixtureTime.getDate();
    if (dayDifference === 1) {
      this.setState(() => ({ time: `Yesterday at ${generateDateString(fixtureTime, true)}` }));
    } else if (dayDifference === 0) {
      this.setState(() => ({ time: `Today at ${generateDateString(fixtureTime, true)}` }));
    } else if (dayDifference === -1) {
      this.setState(() => ({ time: `Tomorrow at ${generateDateString(fixtureTime, true)}` }));
    } else {
      this.setState(() => ({
        time: generateDateString(fixtureTime)
      }))
    }
  }

  render() {
    const { time } = this.state;
    return time ? <div className="fa-fixture-time">{time}</div> : <div />;
  }
}

export default FixtureTime;
