import React from 'react';

import DataLayer from '../../data';

import Fixtures from '../fixtures';
import AsyncComponentLoader from '../async-component-loader';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';

const PlaceholderCompetition = () =>
    import(/* webpackChunkName: "placeholder-competition" */'../placeholder-competition');
const CompetitionCard = () =>
    import(/* webpackChunkName: "competition-card" */'../competition-card');
const CompetitionScrollableTabs = () =>
    import(/* webpackChunkName: "competition-scrollable-tabs" */'../competition-scrollable-tabs');
// const Fixtures = () =>
    // import(/* webpackChunkName: "fixtures" */'../fixtures');
const LeagueTable = () =>
    import(/* webpackChunkName: "league-table" */'../league-table');
const ChampionsLeagueTable = () =>
    import(/* webpackChunkName: "champions-league-table" */'../champions-league-table');
const Teams = () => import(/* webpackChunkName: "teams" */'../teams');

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
    return (
      <AsyncComponentLoader
        loadComponentModule={Teams}
        componentProps={{name, id}}
        componentName="Teams"
      />
    );
  }
  const isChampionsLeague = caption.indexOf('Champions League') === 0;
  const isWorldCup = caption.indexOf("World Cup 2018 Russia") === 0;
  const Table = isChampionsLeague || isWorldCup ? ChampionsLeagueTable : LeagueTable;
  return (
    <AsyncComponentLoader
      loadComponentModule={Table}
      componentProps={{name, id, label: isChampionsLeague ? "Champions League Standings" : "World Cup 2018 Standings"}}
      componentName="Table"
    />
  );
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
          }).catch(e => {});
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
      return (
        <AsyncComponentLoader
          loadComponentModule={PlaceholderCompetition}
          componentName="PlaceholderCompetition"
        />
      );
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
        <AsyncComponentLoader
          loadComponentModule={CompetitionScrollableTabs}
          componentProps={{competitionData, selected, selectCompetitionData: name => this.selectCompetitionData(name)}}
          componentName="CompetitionScrollableTabs"
        />
        <AsyncComponentLoader
          loadComponentModule={CompetitionCard}
          componentProps={{currentMatchday, numberOfMatchdays}}
          componentName="CompetitionCard"
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
