import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MapSearchBox.css';

class MapSearchBox extends Component {
  constructor(props) {
    super(props);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.searchBox = null;
  }

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refs.input);
    if (input) {
      this.searchBox = new google.maps.places.Autocomplete(input);
      if (this.searchBox) {
        this.searchBox.addListener('place_changed', this.onPlacesChanged);
      }
    }
  }

  onPlacesChanged() {
    if (this.props.onPlacesChanged && this.searchBox && this.searchBox.getPlace()) {
      this.props.onPlacesChanged(this.searchBox.getPlace());
    }
  }

  render() {
    return <input ref="input" className={s.searchInput} placeholder={this.props.placeholder} type="text" />;
  }
}

MapSearchBox.propTypes = {
  placeholder: PropTypes.string,
  onPlacesChanged: PropTypes.func.isRequired,
};

export default withStyles(s)(MapSearchBox);
