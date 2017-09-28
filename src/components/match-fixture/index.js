import React from 'react';

import DataLayer from '../../data';

import Fixture from '../fixture';
import Loader from '../loader';

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
      return <Loader message="Loading fixture..." />;
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
