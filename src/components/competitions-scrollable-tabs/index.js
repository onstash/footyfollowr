import React from 'react';

const CompetitionLink = ({ caption, id, selected, selectCompetition }) => {
  const { id: selectedCompetitionID } = selected;
  const className = selectedCompetitionID === id ? 'fa-competition-link-selected' : 'fa-competition-link';
  return (
    <li>
      <div
        className={className}
        onClick={() => selectCompetition({ name: caption, id })}
      >
        { caption }
      </div>
    </li>
  );
};

const CompetitionsScrollableTabs = ({ competitions, selected, selectCompetition }) => (
  <nav className="fa-competitions-scrollable-tabs">
    <ul>
      {
        competitions.map((competition, index) =>
          <CompetitionLink
            {...competition}
            key={ index }
            selected={selected}
            selectCompetition={selectCompetition}
          />)
      }
    </ul>
  </nav>
);

export default CompetitionsScrollableTabs;
