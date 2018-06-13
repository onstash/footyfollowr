import React from 'react';

import TimeDifference from '../time-difference';
import FixtureTime from '../fixture-time';

import parse from 'date-fns/parse';
import isFuture from 'date-fns/is_future';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';

const calculateTimeDifference = (currentTime, timeStamp) => {
    if (isFuture(timeStamp)) {
        return `${distanceInWordsStrict(currentTime, timeStamp)} to go`;
    }
    return `${distanceInWordsStrict(timeStamp, currentTime)} ago`;
};

const FixtureDate = ({ date, status, isGameLive }) => {
  const currentTime = new Date();
  const fixtureTime = parse(date);
  const timeDifferenceLabel = calculateTimeDifference(currentTime, fixtureTime);
  if (!timeDifferenceLabel || isGameLive) {
    return <FixtureTime currentTime={currentTime} fixtureTime={fixtureTime} />
  }

  return (
    <div className="fa-fixture-date">
      <FixtureTime
        currentTime={currentTime}
        fixtureTime={date}
      />
      <TimeDifference label={timeDifferenceLabel} />
    </div>
  );
};

export default FixtureDate;
