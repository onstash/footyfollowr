import React from 'react';

import './styles.css';

const twentyFourHours = 86400000;
const fourtyEightHours = 172800000;

class FixtureTime extends React.Component {
  constructor() {
    super();
    this.state = { time: null };
  }

  componentWillMount() {
    const { timeDifference, fixtureTime } = this.props;
    if (timeDifference < 0 || timeDifference >= fourtyEightHours) {
      this.setState(() => ({
        time: `${fixtureTime.toDateString()} at ${fixtureTime.toTimeString()}`
      }))
    }
    else if (timeDifference < twentyFourHours) {
      this.setState(() => ({ time: `Today at ${fixtureTime.toTimeString()}` }));
    } else if (timeDifference < fourtyEightHours) {
      this.setState(() => ({ time: `Tomorrow at ${fixtureTime.toTimeString()}` }));
    }
  }

  render() {
    const { time } = this.state;
    return time ? <div className="fixture-time">{time}</div> : <div />;
  }
}

export default FixtureTime;
