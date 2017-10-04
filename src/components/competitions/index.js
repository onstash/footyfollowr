import React from 'react';

import DataLayer from '../../data';

import Competition from '../competition';
import CompetitionsScrollableTabs from '../competitions-scrollable-tabs';
import Teams from '../teams';
import Fixtures from '../fixtures';
import LeagueTable from '../league-table';
import ChampionsLeagueTable from '../champions-league-table';

import Cache from '../../utils/cache';
import mixpanel from '../../utils/mixpanel';
import smoothScrollPolyfill from '../../utils/smooth-scroll';
smoothScrollPolyfill();

const CompetitionsError = () => (
  <div className="fa-competitions-container">
    <h2 className="fa-competitions-heading">
      There seems to be a problem, Master Wayne.
    </h2>
  </div>
);

class Competitions extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      competitions: [],
      selected: {name: 'Premier League 2017/18', id: 445}
    };
    this._selectCompetition = this.selectCompetition.bind(this);
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    const onCacheFetchSuccess = distinctID => distinctID;
    const onCacheFetchFailure = () => {};
    Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
      .then(onCacheFetchSuccess, onCacheFetchFailure)
      .then(distinctID => {
        return DataLayer.fetchCompetitions().then(response => {
          const { data: _competitions } = response;
          const competitions = [_competitions[1], _competitions[0]];
          _competitions.forEach((competition, index) => {
            if (index > 1) {
              competitions.push(competition);
            }
          });
          mixpanel.track(distinctID, 'Competitions Viewed');
          this.setState(() => ({ loading: false, competitions }));
        });
      }).catch(error => {
        this.setState(() => ({ loading: false }));
      });
  }

  selectCompetition({ name, id }) {
    const delta = Math.abs(window.innerHeight - window.pageYOffset);
    if (delta) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
      setTimeout(() => {
        this.setState(() => ({ selected: {name, id} }));
      }, delta / 10);
    } else {
      this.setState(() => ({ selected: {name, id} }));
    }
  }

  render() {
    const { loading, competitions, selected } = this.state;

    if (loading) {
      return <div className="fa-competitions-container">Loading</div>;
    }

    if (!competitions) {
      return <CompetitionsError />;
    }

    const { name } = selected;
    const Table = name.indexOf('Champions League') !== -1 ? ChampionsLeagueTable : LeagueTable;

    return (
      <div className="fa-competitions-container">
        <CompetitionsScrollableTabs
          competitions={competitions}
          selected={selected}
          selectCompetition={this._selectCompetition}
        />
        <div className="fa-competitions-data">
          <div className="fa-competitions-data-level-one">
            <Competition {...selected} />
            <Fixtures {...selected} />
          </div>
          <div className="fa-competitions-data-level-one">
            <Table {...selected} />
            <Teams {...selected} />
          </div>
        </div>
      </div>
    );
  }
}

export default Competitions;
