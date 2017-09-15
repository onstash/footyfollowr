import React from 'react';

const FullTimeScore = ({ goalsHomeTeam, goalsAwayTeam }) => {
  if (goalsHomeTeam === null || goalsAwayTeam === null) {
    return <div />;
  }

  return (
    <div className="fa-ft-score">
      <h4 className="fa-ft-score-label">
        FT:
      </h4>
      <div className="fa-ft-score-values">
        <div className="fa-ft-home-team">
          { goalsHomeTeam }
        </div>
        <div className="fa-ft-home-team">
          { goalsAwayTeam }
        </div>
      </div>
    </div>
  );
};

const HalfTimeScore = ({ goalsHomeTeam, goalsAwayTeam }) => {
  if (goalsHomeTeam === null || goalsAwayTeam === null) {
    return <div />;
  }

  return (
    <div className="fa-ht-score">
      <h4 className="fa-ht-score-label">
        HT:
      </h4>
      <div className="fa-ht-score-values">
        <div className="fa-ht-home-team">
          { goalsHomeTeam || 0 }
        </div>
        <div className="fa-ht-home-team">
          { goalsAwayTeam || 0 }
        </div>
      </div>
    </div>
  );
};

const FixtureResult = ({ goalsHomeTeam, goalsAwayTeam, halfTime: halfTimeScore }) => {
  if (goalsHomeTeam !== null && goalsAwayTeam !== null) {
    return (
      <div className="fa-fixture-result">
        <FullTimeScore
          goalsHomeTeam={goalsHomeTeam}
          goalsAwayTeam={goalsAwayTeam}
        />
      </div>
    );
  }

  if (halfTimeScore) {
    return (
      <div className="fa-fixture-result">
      <HalfTimeScore {...halfTimeScore} />
      </div>
    );
  }

  return <div />;
};

export default FixtureResult;
