import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadingIndicator.css';

function LoadingIndicator({loaded, children}) {
  return <Loader className={s.spinner} width={3} length={8} loaded={loaded}>{children}</Loader>;
}

export default withStyles(s)(LoadingIndicator);
