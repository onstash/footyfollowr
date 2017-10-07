import React from 'react';

const CompetitionData = ({
  name,
  selected: { name: selectedName },
  selectCompetitionData
}) => {
  const className = name === selectedName ? 'fa-competition-data-link-selected' : 'fa-competition-data-link';
  return (
    <li>
      <div
        className={className}
        onClick={() => selectCompetitionData(name)}
      >
        { name }
      </div>
    </li>
  );
};

const CompetitionScrollableTabs = ({ competitionData, selected, selectCompetitionData }) => (
  <nav className="fa-competition-scrollable-tabs">
    <ul>
      {
        competitionData.map((competition, index) =>
          <CompetitionData
            {...competition}
            key={ index }
            selected={selected}
            selectCompetitionData={selectCompetitionData}
          />)
      }
    </ul>
  </nav>
);

export default CompetitionScrollableTabs;
