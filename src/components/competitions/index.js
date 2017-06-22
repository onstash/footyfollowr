import React from 'react';

import { fetchCompetitions } from '../../api/methods';

const Competition = props => {
  console.log('Competition props', props);
  return (
    <div>
      {props.caption}
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
    fetchCompetitions().then(competitions => {
      console.log('competitions', competitions);
      this.setState(() => ({ loading: false, competitions }));
    }).catch(error => {
      console.log('error', error);
      this.setState(() => ({ loading: false }));
    });
  }

  render() {
    const { loading, competitions } = this.state;

    console.log('competitions', competitions, typeof competitions);

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
          competitions.map(competition => <Competition {...competition} />)
        }
      </div>
    );
  }
}

export default Competitions;