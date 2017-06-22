import React from 'react';

import { fetchCompetitions } from '../../api/methods';

import { Link } from 'react-router-dom';

const Competition = ({ caption, id }) => {
  return (
    <div>
      <Link to={ `/competitions/${id}` }>
        { caption }
      </Link>
    </div>
  );
};

class Competitions extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competitions: [] };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    fetchCompetitions().then(response => {
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
        <div>
          Loading competitions
        </div>
      );
    }

    if (!competitions) {
      return (
        <div>
          There seems to be an error
        </div>
      );
    }

    return (
      <div>
        {
          competitions.map((competition, index) =>
            <Competition {...competition} key={ index }/>)
        }
      </div>
    );
  }
}

export default Competitions;