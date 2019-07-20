import React from 'react';

import format from 'date-fns/format';

import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import isAfter from 'date-fns/is_after';
import isFuture from 'date-fns/is_future';
import startOfTomorrow from 'date-fns/start_of_tomorrow';

const DATE_FORMATS = {
    DEFAULT: "ddd Do MMM YYYY [at] h:mm A",
    DAY: "h:m A",
};

class FixtureTime extends React.Component {
  constructor() {
    super();
    this.state = { time: null };
  }

  componentWillMount() {
    const { date } = this.props;
    if (isFuture(date)) {
        const currentTime = new Date();
        const diffCalendarDays = differenceInCalendarDays(date, currentTime);
        if (diffCalendarDays === 0) {
            this.setState(() => ({
              time: `Today at ${format(date, DATE_FORMATS.DAY)}`
            }));
        } else if (diffCalendarDays === 1 && isAfter(date, startOfTomorrow())) {
            this.setState(() => ({
              time: `Tomorrow at ${format(date, DATE_FORMATS.DAY)}`
            }));
        } else {
            this.setState(() => ({
              time: format(date, DATE_FORMATS.DEFAULT)
            }));
        }
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
