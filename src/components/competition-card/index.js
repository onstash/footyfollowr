import React from 'react';

const CompetitionCard = ({ currentMatchday, numberOfMatchdays }) => (
  <div className="fa-competition-card-container">
    <div className="fa-competition-card-match-day">
      <div className="fa-competition-card-match-day-label">Week:</div>
      <div className="fa-competition-card-match-day-value">
        <b className="fa-competition-card-current-match-day">
          { currentMatchday }
        </b>
        <div className="fa-competition-card-divider">/</div>
        <div className="fa-competition-card-number-of-match-days">
          { numberOfMatchdays }
        </div>
      </div>
    </div>
  </div>
);

export default CompetitionCard;
