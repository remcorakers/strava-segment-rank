import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FontAwesome from 'react-fontawesome';
import fetch from '../../core/fetch';
import Map from '../../components/Map';
import LoadingIndicator from './../../components/LoadingIndicator';
import Segments from '../../components/Segments';
import s from './Home.css';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.onClickArea = this.onClickArea.bind(this);
    this.state = {
      segments: null,
      loading: false,
    };
  }

  async onClickArea(lat, lng) {
    this.setState({ loading: true });
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{area(lat:${lat},lng:${lng}){bounds,segments{id,name,distance,entriesLast7Days,entriesLast30Days,entriesLast365Days}}}`,
      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.area) throw new Error('Failed to load the area.');
    this.setState({ segments: data.area.segments });
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Strava Segment Rank</h1>
          <Map onClickArea={this.onClickArea} />
          {!this.state.segments && <div className={s.info}><FontAwesome name="info-circle" /> Select an area to see popular segments</div>}
          {this.state.segments && <LoadingIndicator loaded={!this.state.loading}>
            <Segments segments={this.state.segments} />
          </LoadingIndicator>}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
