import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _ from 'lodash';
import SegmentListItem from './../SegmentListItem';
import s from './Segments.css';

class Segments extends React.Component {
  render() {
    const segmentsLast7Days = _.filter(_.orderBy(this.props.segments, 'entriesLast7Days', 'desc'), s => s.entriesLast7Days > 0).map((segment, i) =>
      <SegmentListItem key={i} segmentId={segment.id} name={segment.name} count={segment.entriesLast7Days} distance={segment.distance} />);

    const segmentsLast30Days = _.filter(_.orderBy(this.props.segments, 'entriesLast30Days', 'desc'), s => s.entriesLast30Days > 0).map((segment, i) =>
      <SegmentListItem key={i} segmentId={segment.id} name={segment.name} count={segment.entriesLast30Days} distance={segment.distance} />);

    const segmentsLast365Days = _.filter(_.orderBy(this.props.segments, 'entriesLast365Days', 'desc'), s => s.entriesLast365Days > 0).map((segment, i) =>
      <SegmentListItem key={i} segmentId={segment.id} name={segment.name} count={segment.entriesLast365Days} distance={segment.distance} />);

    return (
      <div className={s.topListWrapper}>
        <div className={s.topList}>
          <h2>Top last 7 days</h2>
          {segmentsLast7Days.length > 0 ? <ul>{segmentsLast7Days}</ul> : <p>No segments found</p>}
        </div>
        <div className={s.topList}>
          <h2>Top last 30 days</h2>
          {segmentsLast30Days.length > 0 ? <ul>{segmentsLast30Days}</ul> : <p>No segments found</p>}
        </div>
        <div className={s.topList}>
          <h2>Top last 365 days</h2>
          {segmentsLast365Days.length > 0 ? <ul>{segmentsLast365Days}</ul> : <p>No segments found</p>}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Segments);
