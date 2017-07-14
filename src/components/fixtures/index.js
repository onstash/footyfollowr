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

  componentWillMount() {
    const { id } = this.props;
    if (!id) {
      return;
    }

    this.setState(() => ({ loading: true }));
    fetchCompetitionFixtures(id).then(response => {
      const { data: fixturesData } = response;
      const { fixtures } = fixturesData;
      this.setState(() => ({ loading: false, fixtures }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  componentWillReceiveProps(nextProps) {
    const { id } = nextProps;
    if (!id) {
      return;
    }

    this.setState(() => ({ loading: true }));
    fetchCompetitionFixtures(id).then(response => {
      const { data: fixturesData } = response;
      const { fixtures } = fixturesData;
      this.setState(() => ({ loading: false, fixtures }));
    }).catch(error => {
      this.setState(() => ({ loading: false }));
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Fixtures shouldComponentUpdate', nextState !== this.state, this.props !== nextProps);
    return nextState !== this.state || this.props !== nextProps;
  }

  render() {
    const { id } = this.props;
    if (!id) {
      return <div />;
    }

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