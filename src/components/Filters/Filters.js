import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Filters.css';

function Filters({ onGridChange, onActivityTypeChange }) {
  return (
    <div className={s.filterWrapper}>
      <div className={s.filter}>
        <label htmlFor="activityType" className={s.label}>Activity type:</label>
        <select name="activityType" id="activityType" onChange={onActivityTypeChange} className={s.select}>
          <option value="running">Running</option>
          <option value="riding">Cycling</option>
        </select>
      </div>
      <div className={s.filter}>
        <label htmlFor="gridSize" className={s.label}>Grid size:</label>
        <select name="gridSize" id="gridSize" onChange={onGridChange} className={s.select}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </div>
  );
}

Filters.propTypes = {
  onGridChange: PropTypes.func.isRequired,
  onActivityTypeChange: PropTypes.func.isRequired,
};

export default withStyles(s)(Filters);
