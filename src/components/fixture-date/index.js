import React from 'react';

import TimeDifference from '../time-difference';
import FixtureTime from '../fixture-time';

import parse from 'date-fns/parse';
import isFuture from 'date-fns/is_future';
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';

const calculateTimeDifference = ({ timeStamp }) => {
    const currentTime = new Date();
    if (isFuture(timeStamp)) {
        return `${distanceInWordsStrict(currentTime, timeStamp)} to go`;
    }
    return `${distanceInWordsStrict(timeStamp, currentTime)} ago`;
};

const FixtureDate = ({ date, status, isGameLive }) => {
  const fixtureTime = parse(date);
  const timeDifferenceLabel = calculateTimeDifference({ timeStamp: fixtureTime });
  if (!timeDifferenceLabel || isGameLive) {
    return <FixtureTime date={fixtureTime} />;
  }

  return (
    <div className="fa-fixture-date">
      <FixtureTime date={fixtureTime} />
      <TimeDifference label={timeDifferenceLabel} />
    </div>
  );
};

export default FixtureDate;
