import React from 'react';

import DataLayer from '../../data';

import PlaceholderCompetition from '../placeholder-competition';
import Teams from '../teams';
import Fixtures from '../fixtures';
import LeagueTable from '../league-table';
import ChampionsLeagueTable from '../champions-league-table';
import CompetitionCard from '../competition-card';
import CompetitionScrollableTabs from '../competition-scrollable-tabs';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

const CompetitionError = () => (
  <div className="fa-competition-error-container">
    <div className="fa-competition-error">
      No competition info available, Master Wayne.
    </div>
  </div>
);

const CompetitionData = ({ caption, name, id, selected: { name: selectedName } }) => {
  if (selectedName === 'Fixtures') {
    return <Fixtures name={name} id={id} />;
  }
  if (selectedName === 'Teams') {
    return <Teams name={name} id={id} />;
  }
  const Table = caption.indexOf('Champions League') !== -1 ? ChampionsLeagueTable : LeagueTable;
  return <Table name={name} id={id} />;
};

class Competition extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      competition: {},
      competitionID: null,
      selected: { name: 'Fixtures' },
      competitionData: [
        { name: 'Fixtures' },
        { name: 'Table' },
        { name: 'Teams' }
      ]
    };
    this.mounted = false;
  }

  fetchCompetitionData(competitionID) {
    if (!competitionID) {
      return;
    }
    if (this.mounted) {
      this.setState(() => ({ loading: true }));
    }
    DataLayer.fetchCompetition(competitionID)
      .then(response => {
        const { data: competition } = response;
        const { caption: name } = competition;
        Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
          .then(distinctID => {
            mixpanel.track(
              distinctID,
              'Competition Viewed',
              { name, id: competitionID }
            );
          }).catch(console.error);
        if (this.mounted) {
          this.setState(() => ({ loading: false, competition, competitionID }));
        }
      })
      .catch(error => {
        if (this.mounted) {
          this.setState(() => ({ loading: false, competition: {}, competitionID }));
        }
      });
  }

  componentDidMount() {
    this.mounted = true;
    const { id: competitionID } = this.props;
    this.fetchCompetitionData(competitionID);
  }

  componentWillReceiveProps({ id: newCompetitionID }) {
    const { id: oldCompetitionID } = this.props;
    if (newCompetitionID === oldCompetitionID) {
      return;
    }
    this.fetchCompetitionData(newCompetitionID);
  }

  selectCompetitionData(name) {
    this.setState(() => ({ selected: { name } }));
  }

  render() {
    const { loading, competition, competitionData, selected } = this.state;
    if (loading) {
      return <PlaceholderCompetition />;
    }

    const {
      caption,
      numberOfMatchdays,
      currentMatchday
    } = competition;

    if (!competition || !numberOfMatchdays || !currentMatchday) {
      return <CompetitionError />;
    }

    const { name, id } = this.props;

    return (
      <div className="fa-competition-container">
        <CompetitionScrollableTabs
          competitionData={competitionData}
          selected={selected}
          selectCompetitionData={name => this.selectCompetitionData(name)}
        />
        <CompetitionCard
          currentMatchday={currentMatchday}
          numberOfMatchdays={numberOfMatchdays}
        />
        <div className="fa-competition-data">
          <CompetitionData
            caption={caption}
            name={name}
            id={id}
            selected={selected}
          />
        </div>
      </div>
    );
  }
};

export default Competition;
