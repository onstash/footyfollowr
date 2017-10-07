import React from 'react';

const selectedName = 'Fixtures';
const selectedClassName = 'fa-placeholder-competition-data-link-selected';
const defaultClassName = 'fa-placeholder-competition-data-link';

const PlaceholderCompetitionData = ({
  name,
}) => {
  const className =
    name === selectedName ? selectedClassName: defaultClassName;
  return (
    <li>
      <div
        className={className}
      >
        { name }
      </div>
    </li>
  );
};

const PlaceholderCompetitionScrollableTabs = () => (
  <nav className="fa-placeholder-competition-scrollable-tabs">
    <ul>
      <PlaceholderCompetitionData name="Fixtures" />
      <PlaceholderCompetitionData name="Table" />
      <PlaceholderCompetitionData name="Teams" />
    </ul>
  </nav>
);

export default PlaceholderCompetitionScrollableTabs;
