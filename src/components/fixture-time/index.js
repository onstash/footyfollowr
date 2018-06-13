import React from 'react';

import format from 'date-fns/format';
import isToday from 'date-fns/is_today';
import isTomorrow from 'date-fns/is_tomorrow';
import isYesterday from 'date-fns/is_yesterday';

const DATE_FORMATS = {
    DEFAULT: "ddd Do MMM YYYY [at] h:m A",
    DAY: "h:m A",
};

class FixtureTime extends React.Component {
  constructor() {
    super();
    this.state = { time: null };
  }

  componentWillMount() {
    const { fixtureTime: date } = this.props;
    if (isYesterday(date)) {
      this.setState(() => ({ time: `Yesterday at ${format(date, DATE_FORMATS.DAY)}` }));
    } else if (isToday(date)) {
      this.setState(() => ({ time: `Today at ${format(date, DATE_FORMATS.DAY)}` }));
    } else if (isTomorrow(date)) {
      this.setState(() => ({ time: `Tomorrow at ${format(date, DATE_FORMATS.DAY)}` }));
    } else {
      this.setState(() => ({
        time: format(date, DATE_FORMATS.DEFAULT)
      }));
    }
  }

  render() {
    const { time } = this.state;
    return time ? <div className="fa-fixture-time">{time}</div> : null;
  }
}

export default FixtureTime;
