import React from 'react';

import DataLayer from '../../data';

import { Link } from 'react-router-dom';

import './styles.css';

const Competition = ({ caption, id }) => {
  return (
    <Link to={ `/competitions/${id}` } className="competition-link-container">
      <div className="competition-link">
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
    DataLayer.fetchCompetitions().then(response => {
      const { data: competitions } = response;
      this.setState(() => ({ loading: false, competitions }));
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
      return (
        <div className="competitions-container">
          <h2 className="competitions-heading">
            There seems to be an error
          </h2>
        </div>
      );
    }

    return (
      <div className="competitions-container">
        <h2 className="competitions-heading">
          Competitions
        </h2>
        <div className="competitions">
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
