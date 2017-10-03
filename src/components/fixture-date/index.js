import React from 'react';

import TimeDifference from '../time-difference';
import FixtureTime from '../fixture-time';

const calculateTimeDifference = (currentTime, timeStamp) => {
  const suffix = currentTime > timeStamp ? 'ago' : 'to go';
  const difference = timeStamp - currentTime;
  const deltaSeconds = Math.abs(Math.round(difference / 1000));
  const deltaMinutes = Math.abs(Math.round(deltaSeconds / 60));
  const deltaHours = Math.abs(Math.round(deltaMinutes / 60));
  const deltaDays = Math.abs(Math.round(deltaHours / 24));
  const deltaWeeks = Math.abs(Math.round(deltaDays / 7));
  const deltaMonths = Math.abs(Math.round(deltaWeeks / 4));
  let timeDelta, unit;
  if (deltaSeconds < 60) {
    timeDelta = parseInt(deltaSeconds, 10);
    unit = 'second';
  } else if (deltaMinutes < 60) {
    timeDelta = parseInt(deltaMinutes, 10);
    unit = 'min';
  } else if (deltaHours < 24) {
    timeDelta = parseInt(deltaHours, 10);
    unit = 'hour';
  } else if (deltaDays < 7) {
    timeDelta = parseInt(deltaDays, 10);
    unit = 'day';
  } else if (deltaWeeks < 4) {
    timeDelta = parseInt(deltaWeeks, 10);
    unit = 'week';
  } else if (deltaMonths < 12) {
    timeDelta = parseInt(deltaMonths, 10);
    unit = 'month';
  }
  switch (timeDelta) {
    case 0:
      return `moments ${suffix}`;
    case 1:
      switch (unit) {
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

const FixtureDate = ({ date, status }) => {
  const currentTime = new Date();
  const fixtureTime = new Date(date);
  const timeDifferenceLabel = calculateTimeDifference(currentTime, fixtureTime);
  if (!timeDifferenceLabel) {
    return <FixtureTime currentTime={currentTime} fixtureTime={fixtureTime} />
  }

  return (
    <div className="fa-fixture-date">
      <FixtureTime
        currentTime={currentTime}
        fixtureTime={fixtureTime}
      />
      <TimeDifference label={timeDifferenceLabel} />
    </div>
  );
};

export default FixtureDate;
