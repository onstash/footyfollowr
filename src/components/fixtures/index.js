import React from 'react';

import { fetchCompetitionFixtures } from '../../api/methods';

import { Link } from 'react-router-dom';

const Fixture = ({ homeTeamName, awayTeamName, date, matchday, status }) => (
  <div>
    <div>
      { homeTeamName } vs { awayTeamName }
    </div>
    <div>
      { status }
    </div>
    <div>
      { date }
    </div>
  </div>
);

class Fixtures extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, fixtures: [] };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    fetchCompetitionFixtures(this.props.match.params.id).then(response => {
      const { data: fixturesData } = response;
      const { fixtures } = fixturesData;
      this.setState(() => ({ loading: false, fixtures }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  render() {
    const { loading, fixtures } = this.state;

    if (loading) {
      return <div>Loading</div>;
    }

    if (!fixtures) {
      return <div>There's something wrong!</div>;
    }

    return (
      <div>
        {
          fixtures.map((fixture, index) =>
            <Fixture {...fixture} key={ index }/>
          )
        }
      </div>
    );
  }
};

export default Fixtures;