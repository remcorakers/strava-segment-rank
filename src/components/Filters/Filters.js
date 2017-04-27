import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Filters.css';

function Filters({ onActivityTypeChange, onGridChange, gridSize, activityType }) {
  return (
    <div className={s.filterWrapper}>
      <div className={s.filter}>
        <div className={s.label}>Activity type:</div>
        <button
          className={activityType === 'running' ? [s.active, s.buttonLink].join(' ') : s.buttonLink}
          onClick={() => onActivityTypeChange('running')}
        >Running</button>
        <button
          className={activityType === 'riding' ? [s.active, s.buttonLink].join(' ') : s.buttonLink}
          onClick={() => onActivityTypeChange('riding')}
        >Cycling</button>
      </div>
      <div className={s.filter}>
        <div className={s.label}>Grid size:</div>
        <button
          className={gridSize === 'small' ? [s.active, s.buttonLink].join(' ') : s.buttonLink}
          onClick={() => onGridChange('small')}
        >Small</button>
        <button
          className={gridSize === 'medium' ? [s.active, s.buttonLink].join(' ') : s.buttonLink}
          onClick={() => onGridChange('medium')}
        >Medium</button>
        <button
          className={gridSize === 'large' ? [s.active, s.buttonLink].join(' ') : s.buttonLink}
          onClick={() => onGridChange('large')}
        >Large</button>
      </div>
    </div>
  );
}

Filters.propTypes = {
  onGridChange: PropTypes.func.isRequired,
  onActivityTypeChange: PropTypes.func.isRequired,
  activityType: PropTypes.oneOf(['running', 'riding']).isRequired,
  gridSize: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
};

export default withStyles(s)(Filters);
