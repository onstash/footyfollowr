import React from 'react';

import TimeDifference from '../time-difference';
import FixtureTime from '../fixture-time';

import './styles.css';

const calculateTimeDifference = timeStampString => {
  const timeStamp = new Date(timeStampString);
  const currentTime = new Date().getTime();
  const suffix = currentTime > timeStamp ? 'ago' : 'to go';
  const difference = timeStamp - currentTime;
  const deltaSeconds = Math.abs(Math.round(difference / 1000));
  const deltaMinutes = Math.abs(Math.round(deltaSeconds / 60));
  const deltaHours = Math.abs(Math.round(deltaMinutes / 60));
  const deltaDays = Math.abs(Math.round(deltaHours / 24));
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
  } else if (deltaDays <= 7) {
    timeDelta = parseInt(deltaDays);
    unit = 'day';
  } else {
    return;
  }
  switch (timeDelta) {
    case 0:
      return {label: `moments ${suffix}`, difference, date: timeStamp};
    case 1:
      switch (unit) {
        case 'day':
          switch (suffix) {
            case 'ago':
              return {label: 'a day ago', difference, date: timeStamp};
            default:
              return {label: '', difference, date: timeStamp};
          }
        case 'hour':
          return {label: `an hour ${suffix}`, difference, date: timeStamp};
        default:
          return {label: `moments ${suffix}`, difference, date: timeStamp};
      }
    default:
      switch (suffix) {
        case 'second':
          return {label: `moments ${suffix}`, difference, date: timeStamp};
        default:
          switch (unit) {
            case 'day':
              switch (suffix) {
                case 'to go':
                  return {
                    label: '',
                    difference,
                    date: timeStamp
                  };
                default:
                  return {
                    label: `${timeDelta} ${unit}s ${suffix}`,
                    difference,
                    date: timeStamp
                  };
              }
            default:
              return {
                label: `${timeDelta} ${unit}s ${suffix}`,
                difference,
                date: timeStamp
              };
          }
      }
  }
};

const FixtureDate = ({ date, status }) => {
  const timeDifference = calculateTimeDifference(date);
  if (!timeDifference) {
    return <div />;
  }
  const { label, difference, date: actualDate } = timeDifference;
  if (!label || status === 'FINISHED') {
    return <FixtureTime timeDifference={difference} fixtureTime={actualDate} />
  }

  return (
    <div className="fixture-date">
      <FixtureTime timeDifference={difference} fixtureTime={actualDate} />
      <TimeDifference label={label} />
    </div>
  );
};

export default FixtureDate;
