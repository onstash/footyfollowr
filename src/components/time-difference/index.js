import React from 'react';

const calculateTimeDifference = timeStampString => {
  const timeStamp = new Date(timeStampString);
  const currentTime = new Date().getTime();
  const suffix = currentTime > timeStamp ? 'ago' : 'to go';
  const difference = currentTime - timeStamp;
  const deltaSeconds = Math.abs(Math.round(difference / 1000));
  const deltaMinutes = Math.abs(Math.round(deltaSeconds / 60));
  const deltaHours = Math.abs(Math.round(deltaMinutes / 60));
  const deltaDays = Math.abs(Math.round(deltaHours / 24));
  const deltaWeeks = Math.abs(Math.round(deltaDays / 7));
  const deltaMonths = Math.abs(Math.round(deltaWeeks / 4));
  let timeDelta, unit;
  if (deltaSeconds < 60) {
    timeDelta = parseInt(deltaSeconds);
    unit = 'second';
  } else if (deltaMinutes < 60) {
    timeDelta = parseInt(deltaMinutes);
    unit = 'minute';
  } else if (deltaHours < 24) {
    timeDelta = parseInt(deltaHours);
    unit = 'hour';
  } else if (deltaDays < 7) {
    timeDelta = parseInt(deltaDays);
    unit = 'day';
  } else if (deltaWeeks < 4) {
    timeDelta = parseInt(deltaWeeks);
    unit = 'week';
  } else {
    timeDelta = parseInt(deltaMonths);
    unit = 'month';
  }
  switch (timeDelta) {
    case 0:
      return `moments ${suffix}`;
    case 1:
      switch (unit) {
        case 'month':
          return `a month ${suffix}`;
        case 'week':
          return `a week ${suffix}`;
        case 'day':
          return `a day ${suffix}`;
        case 'hour':
          return `an hour ${suffix}`;
        default:
          return `moments ${suffix}`;
      }
    default:
      switch (suffix) {
        case 'second':
          return `moments ${suffix}`;
        default:
          return `${timeDelta} ${unit}s ${suffix}`;
      }
  }
};

class TimeDifference extends React.Component {
  constructor(props) {
    super();
    const { timeStampString } = props;
    const timeDifference = calculateTimeDifference(timeStampString);
    this.state = { timeDifference };
  }

  componentDidMount() {
    const { timeDifference } = this.state;
    if (timeDifference.match('second')) {
      this.interval = setInterval(() => this.intervalUpdater(), 1000);
    } else if (timeDifference.match('minute')) {
      this.interval = setInterval(() => this.intervalUpdater(), 1000 * 60);
    }
  }

  intervalUpdater() {
    const { timeStampString } = this.props;
    const timeDifference = calculateTimeDifference(timeStampString);
    if (timeDifference && timeDifference !== this.state.timeDifference) {
      this.setState(() => ({ timeDifference }));
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { timeDifference } = this.state;
    if (!timeDifference) {
      return <div />;
    }
    const className = timeDifference.match('to go') ? 'future' : 'past';
    return (
      <div className={`time-difference ${className}`}>
        {timeDifference}
      </div>
    );
  }
}

export default TimeDifference;
