import React from 'react';

import DataLayer from '../../data';

import { Link } from 'react-router-dom';

import Cache from '../../utils/cache';
import fetchIPInformation from '../../utils/ip';
import mixpanel from '../../utils/mixpanel';

const CompetitionsError = () => (
  <div className="fa-competitions-container">
    <h2 className="fa-competitions-heading">
      There seems to be a problem, Master Wayne.
    </h2>
  </div>
);

const Competition = ({ caption, id }) => {
  return (
    <Link to={ `/competitions/${id}` } className="fa-competition-link-container">
      <div className="fa-competition-link">
        { caption }
      </div>
    </Link>
  );
};

class Competitions extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competitions: [] };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    const onCacheFetchSuccess = distinctID => distinctID;
    const onCacheFetchFailure = () => {};
    Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
      .then(onCacheFetchSuccess, onCacheFetchFailure)
      .then(distinctID => {
        return DataLayer.fetchCompetitions().then(response => {
          const { data: competitions } = response;
          mixpanel.track(distinctID, 'Competitions Viewed');
          this.setState(() => ({ loading: false, competitions }));
        });
      }).catch(error => {
        this.setState(() => ({ loading: false }));
      });
  }

  render() {
    const { loading, competitions } = this.state;

    if (loading) {
      return (
        <div className="competitions-container">
          <h2 className="competitions-heading">
            Loading competitions...
          </h2>
        </div>
      );
    }

    if (!competitions) {
      return <CompetitionsError />;
    }

    return (
      <div className="fa-competitions-container">
        <h2 className="fa-competitions-heading">
          Competitions
        </h2>
        <div className="fa-competitions">
          {
            competitions.map((competition, index) =>
              <Competition {...competition} key={ index }/>)
          }
        </div>
      </div>
    );
  }
}

export default Competitions;
