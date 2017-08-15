import React from 'react';

import './styles.css';

const FullTimeScore = ({ goalsHomeTeam, goalsAwayTeam }) => {
  if (goalsHomeTeam === null || goalsAwayTeam === null) {
    return <div />;
  }

  return (
    <div className="ft-score">
      <h4 className="ft-score-label">
        FT:
      </h4>
      <div className="ft-score-values">
        <div className="ft-home-team">
          { goalsHomeTeam }
        </div>
        <div className="score-separator">
          :
        </div>
        <div className="ft-home-team">
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
    <div className="ht-score">
      <h4 className="ht-score-label">
        HT:
      </h4>
      <div className="ht-score-values">
        <div className="ht-home-team">
          { goalsHomeTeam || 0 }
        </div>
        <div className="score-separator">
          :
        </div>
        <div className="ht-home-team">
          { goalsAwayTeam || 0 }
        </div>
      </div>
    </div>
  );
};

const FixtureResult = ({ goalsHomeTeam, goalsAwayTeam, halfTime: halfTimeScore }) => {
  if (goalsHomeTeam === null || goalsAwayTeam === null) {
    return <div />;
  }

  return (
    <div className="fixture-result">
      <FullTimeScore
        goalsHomeTeam={goalsHomeTeam}
        goalsAwayTeam={goalsAwayTeam}
      />
      <HalfTimeScore {...halfTimeScore} />
    </div>
  );
};

export default FixtureResult;
