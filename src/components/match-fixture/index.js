import React from 'react';

import DataLayer from '../../data';
import mixpanel from '../../utils/mixpanel';
import Cache from '../../utils/cache';

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
      Cache.get(Cache.keys.MIXPANEL_DISTINCT_ID)
        .then(distinctID => {
          const eventProperties = {
            id: this.props.match.params.fixtureID,
            homeTeamName: fixture.homeTeamName,
            awayTeamName: fixture.awayTeamName,
            scheduled: fixture.date,
            matchDay: fixture.matchday
          };
          mixpanel.track(
            distinctID,
            'Fixture Viewed',
            eventProperties
          );
        }).catch(console.error)
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
