import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import GoogleMapReact from 'google-map-react';
import MapSearchBox from './../MapSearchBox';
import s from './Map.css';
import controllable from 'react-controllables';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      center: this.props.center,
      map: null,
      rectangles: [],
      selectedArea: null,
      showZoomMessage: false,
    };

    this.latStepSize = 0.005;
    this.lngStepSize = 0.01;

    this.onChange = this.onChange.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.centerOnMyLocation = this.centerOnMyLocation.bind(this);
    this.onClickArea = this.onClickArea.bind(this);
    this.roundLat = this.roundLat.bind(this);
    this.roundLng = this.roundLng.bind(this);
  }

  componentDidMount() {
    this.centerOnMyLocation();
  }

  setMap(map) {
    this.setState({ map });
  }

  centerOnMyLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.setState({
          center: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        });
      },
    );
  }

  addRectangle(north, south, west, east, selected) {
    if (!this.state.map) {
      return;
    }

    const rectangle = new google.maps.Rectangle({
      strokeColor: selected ? '#ff0000' : '#123abc',
      strokeOpacity: 1,
      strokeWeight: selected ? 4 : 1,
      fillColor: '#abc234',
      fillOpacity: 0.0,
      map: this.state.map,
      bounds: {
        north,
        south,
        east,
        west,
      },
      zIndex: selected ? 999 : 998,
    });
    rectangle.addListener('click', this.onClickArea);

    const rectangles = this.state.rectangles;
    rectangles.push(rectangle);
    this.setState({ rectangles });
  }

  roundLat(lat) {
    return Math.round(lat / this.latStepSize) * this.latStepSize; // round to nearest 0.005
  }

  roundLng(lng) {
    return Math.round(lng / this.lngStepSize) * this.lngStepSize; // round to nearest 0.01
  }

  onClickArea(props) {
    const lat = this.roundLat(props.latLng.lat());
    const lng = this.roundLng(props.latLng.lng());

    console.log(`Clicked in area lat:${lat}, lng:${lng}`);
    this.setState({selectedArea: {lat, lng}});

    this.props.onClickArea(lat, lng);

    // highlight clicked rectangle
    this.state.rectangles.forEach(r => {
      if(r.getBounds().contains(new google.maps.LatLng(lat, lng))) {
        r.setOptions({strokeColor: '#ff0000', strokeWeight: 4, zIndex: 999});
      } else {
        r.setOptions({strokeColor: '#123abc', strokeWeight: 1, zIndex: 998});
      }
    });
  }

  onChange(props) {
    // Remove existing rectangles
    this.state.rectangles.forEach(r => r.setMap(null));
    this.setState({ rectangles: [] });

    if(props.zoom <= 12) {
      this.setState({showZoomMessage: true});
      return;
    }
    this.setState({showZoomMessage: false});

    const startLat = this.roundLat(props.bounds.se.lat);
    const startLng = this.roundLng(props.bounds.nw.lng);

    const endLat = this.roundLat(props.bounds.nw.lat) + this.latStepSize;
    const endLng = this.roundLng(props.bounds.se.lng) + this.lngStepSize;

    let count = 0;
    for (let lat = Math.min(startLat, endLat); lat <= Math.max(startLat, endLat); lat += this.latStepSize) {
      for (let lng = Math.min(startLng, endLng); lng <= Math.max(startLng, endLng); lng += this.lngStepSize) {
        const north = lat + this.latStepSize/2;
        const south = lat - this.latStepSize/2;
        const west = lng - this.lngStepSize/2;
        const east = lng + this.lngStepSize/2;

        const selected = this.state.selectedArea && this.state.selectedArea.lat === this.roundLat(lat) && this.state.selectedArea.lng === this.roundLng(lng);

        this.addRectangle(north, south, west, east, selected);

        count++;
        if (count > 300) {
          console.log(`Maximum rectenagles of ${count} reached. Stopping rendering.`);
          return;
        }
      }
    }
  }

  onPlacesChanged(place) {
    if (!place.geometry || !place.geometry.location) {
      console.log('Returned place contains no geometry');
      return;
    }

    this.setState({
      center: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    });
  }

  render() {
    return (
      <div>
        <MapSearchBox onPlacesChanged={this.onPlacesChanged} placeholder="Search a location" />
        <button onClick={this.centerOnMyLocation}><FontAwesome name="crosshairs" /> Find me!</button>
        {this.state.showZoomMessage && <div><FontAwesome name="info-circle" /> Zoom in to select an area</div>}
        <div className={s.mapWrapper}>
          <GoogleMapReact
            onGoogleApiLoaded={({ map, maps }) => this.setMap(map)}
            yesIWantToUseGoogleMapApiInternals
            options={{ disableDefaultUI: false }}
            center={this.state.center}
            defaultZoom={this.props.zoom}
            onChildClick={this.props.onClickArea}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

Map.propTypes = {
  center: PropTypes.object, // @controllable
  zoom: PropTypes.number, // @controllable
  hoverKey: PropTypes.string, // @controllable
  clickKey: PropTypes.string, // @controllable
  onCenterChange: PropTypes.func, // @controllable generated fn
  onZoomChange: PropTypes.func, // @controllable generated fn
  onHoverKeyChange: PropTypes.func, // @controllable generated fn
  onClickArea: PropTypes.func.isRequired,
};

Map.defaultProps = {
  center: { lat: 52.38, lng: 4.6462 },
  zoom: 14,
};

export default controllable(withStyles(s)(Map), ['center', 'zoom', 'hoverKey', 'clickKey']);
