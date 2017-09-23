import React from 'react';

import DataLayer from '../../data';

import Fixture from '../fixture';

class MatchFixture extends React.Component {
  constructor() {
    super();
    this.state = {
      fixture: {},
      loading: true
    };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    DataLayer.fetchFixture(this.props.match.params.fixtureID).then(({ data: { fixture: _fixture, head2head } }) => {
      const fixture = Object.assign({}, _fixture, { headToHead: head2head });
      this.setState(() => ({ loading: false, fixture }));
    });
  }

  render() {
    const {
      fixture,
      loading
    } = this.state;
    if (loading) {
      return <h2>Loading fixture</h2>
    }

    return (
      <Fixture
        source="MatchFixture"
        {...fixture}
      />
    );
  }
}

export default MatchFixture;
