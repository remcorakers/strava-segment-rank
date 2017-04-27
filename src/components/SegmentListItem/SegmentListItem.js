import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SegmentListItem.css';

function SegmentListItem({ count, name, distance, segmentId }) {
  return (
    <li key={segmentId}>
      <div className={s.count}>{count}</div>
      <div className={s.segmentName}>
        <a href={`https://www.strava.com/segments/${segmentId}`}>{name}</a>
        <span className={s.distance}> ({distance}m)</span>
      </div>
    </li>);
}

SegmentListItem.propTypes = {
  count: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired,
  segmentId: PropTypes.number.isRequired,
};

export default withStyles(s)(SegmentListItem);
