import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import _ from 'lodash';
import SegmentListItem from './../SegmentListItem';
import s from './Segments.css';

class Segments extends React.Component {
  render() {
    const segmentsLast7Days = _.filter(_.orderBy(this.props.segments, 'entriesLast7Days', 'desc'),
      x => x.entriesLast7Days > 0).map(segment =>
        <SegmentListItem
          key={segment.id} segmentId={segment.id} name={segment.name}
          count={segment.entriesLast7Days} distance={segment.distance}
        />);

    const segmentsLast30Days = _.filter(_.orderBy(this.props.segments, 'entriesLast30Days', 'desc'),
    x => x.entriesLast30Days > 0).map(segment =>
      <SegmentListItem
        key={segment.id} segmentId={segment.id} name={segment.name}
        count={segment.entriesLast30Days} distance={segment.distance}
      />);

    const segmentsLast365Days = _.filter(_.orderBy(this.props.segments, 'entriesLast365Days', 'desc'),
    x => x.entriesLast365Days > 0).map(segment =>
      <SegmentListItem
        key={segment.id} segmentId={segment.id} name={segment.name}
        count={segment.entriesLast365Days} distance={segment.distance}
      />);

    return (
      <div className={s.topListWrapper}>
        <div className={s.topList}>
          <h2>Top last 7 days</h2>
          {segmentsLast7Days.length > 0 ? <ul>{segmentsLast7Days}</ul> : <p className={s.noSegmentsFound}>No segments found.</p>}
        </div>
        <div className={s.topList}>
          <h2>Top last 30 days</h2>
          {segmentsLast30Days.length > 0 ? <ul>{segmentsLast30Days}</ul> : <p className={s.noSegmentsFound}>No segments found.</p>}
        </div>
        <div className={s.topList}>
          <h2>Top this year</h2>
          {segmentsLast365Days.length > 0 ? <ul>{segmentsLast365Days}</ul> : <p className={s.noSegmentsFound}>No segments found.</p>}
        </div>
      </div>
    );
  }
}

Segments.propTypes = {
  segments: PropTypes.array.isRequired, // eslint-disable-line
};

export default withStyles(s)(Segments);
