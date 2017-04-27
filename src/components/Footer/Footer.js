import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.css';
import Link from '../Link';

class Footer extends React.Component {
  render() {
    return (
      <div>
        <div className={s.container}>
          <Link className={s.link} to="/">Home</Link>
          <span>·</span>
          <Link className={s.link} to="/about">About</Link>
          <span>·</span>
          <a className={s.link} href="https://github.com/remcorakers/strava-segment-rank">GitHub</a>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Footer);
