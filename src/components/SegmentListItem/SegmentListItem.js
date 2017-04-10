import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SegmentListItem.css';

function SegmentListItem({ count, name, distance, segmentId }) {
  return (
    <li key={segmentId}>
      <div className={s.count}>{count}</div>
      <div className={s.segmentName}>
        <a href={`https://www.strava.com/segments/${segmentId}`} target="_blank">{name}</a>
        <span className={s.distance}> ({distance}m)</span>
      </div>
    </li>);
}

export default withStyles(s)(SegmentListItem);
