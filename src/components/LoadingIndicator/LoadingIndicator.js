import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadingIndicator.css';

function LoadingIndicator({ loaded, children }) {
  return (<div>
    <Loader className={s.spinner} width={3} length={8} loaded={loaded}>{children}</Loader>
    {!loaded && <div className={s.loadingMessage}>Downloading segments, please wait...</div>}
  </div>);
}

LoadingIndicator.propTypes = {
  loaded: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default withStyles(s)(LoadingIndicator);
