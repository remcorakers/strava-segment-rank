/* global google */
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MapSearchBox.css';

class MapSearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      geocodeResults: null,
      loading: false,
    };
    this.searchBox = null;
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const input = ReactDOM.findDOMNode(this.refs.input); // eslint-disable-line
    if (input) {
      this.searchBox = new google.maps.places.Autocomplete(input);
      if (this.searchBox) {
        this.searchBox.addListener('place_changed', this.onPlacesChanged);
      }
    }
  }

  handleSelect(address) {
    this.setState({ address });
    geocodeByAddress(address, (err, { lat, lng }) => {
      if (err) {
        console.log(err);
      }
      this.props.onPlacesChanged(lat, lng);
    });
  }

  handleChange(address) {
    this.setState({
      address,
      geocodeResults: null,
    });
  }

  render() {
    const cssClasses = {
      input: s.searchInput,
      autocompleteContainer: s.autocompleteContainer,
    };

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className={s.suggestionItem}>
        <i className="fa fa-map-marker" />
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>);

    return (<PlacesAutocomplete
      value={this.state.address}
      onChange={this.handleChange}
      onSelect={this.handleSelect}
      autocompleteItem={AutocompleteItem}
      autoFocus
      placeholder="Search a location"
      hideLabel
      onEnterKeyDown={this.handleSelect}
      classNames={cssClasses}
    />);
  }
}

MapSearchBox.propTypes = {
  onPlacesChanged: PropTypes.func.isRequired,
};

export default withStyles(s)(MapSearchBox);
