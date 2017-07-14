import React from 'react';

import { fetchCompetitions } from '../../api/methods';

import Competition from '../competition';

const Option = ({ caption, id }) => {
  return <option value={JSON.stringify({id, caption})}>{caption}</option>;
}

const generateCompetitionOption = ({ caption, id }) => {
  return { description: caption, code: id };
};

class Competitions extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, competitions: [], caption: null, id: null };
  }

  componentDidMount() {
    this.setState(() => ({ loading: true }));
    fetchCompetitions().then(response => {
      const { data: competitions } = response;
      this.setState(() => ({ loading: false, competitions }));
    }).catch(error => {
      console.log('error', error);
      this.setState(() => ({ loading: false }));
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Competitions shouldComponentUpdate', this.state !== nextState);
    return this.state !== nextState;
  }

  onSelect(event) {
    const { caption, id } = JSON.parse(event.target.value);
    this.setState(() => ({ id, caption }));
  }

  render() {
    const { loading, competitions, caption, id } = this.state;

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
        <select
          className="competitions"
          placeholder="Select a competition"
          value={caption || ''}
          onChange={(event) => this.onSelect(event)}
        >
          {
            competitions.map((competition, index) => <Option key={ index } {...competition} />)
          }
        </select>
        <Competition id={id} />
      </div>
    );
  }
}

export default Competitions;