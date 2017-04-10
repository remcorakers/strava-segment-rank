import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import GoogleMapReact from 'google-map-react';
import controllable from 'react-controllables';
import Filters from './../Filters';
import MapSearchBox from './../MapSearchBox';
import s from './Map.css';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.baseLatStepSize = 0.005;
    this.baseLngStepSize = 0.01;

    this.state = {
      center: props.center,
      map: null,
      bounds: null,
      zoom: props.zoom,
      gridSize: 'small',
      activityType: props.activityType,
      rectangles: [],
      selectedArea: null,
      showZoomMessage: false,
      latStepSize: this.baseLatStepSize,
      lngStepSize: this.baseLngStepSize,
    };

    this.onChange = this.onChange.bind(this);
    this.onPlacesChanged = this.onPlacesChanged.bind(this);
    this.centerOnMyLocation = this.centerOnMyLocation.bind(this);
    this.onClickArea = this.onClickArea.bind(this);
    this.round = this.round.bind(this);
    this.onGridChange = this.onGridChange.bind(this);
    this.onActivityTypeChange = this.onActivityTypeChange.bind(this);
  }

  componentDidMount() {
    this.centerOnMyLocation();
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

  roundToPrecision(number, precision) {
    const factor = 10 ** precision;
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  round(value, stepSize) {
    const roundToStepsize = Math.round(value / stepSize) * stepSize;
    const roundToPrecision = this.roundToPrecision(roundToStepsize, 3);
    return roundToPrecision;
  }

  onClickArea(props) {
    const lat = this.round(props.latLng.lat(), this.state.latStepSize);
    const lng = this.round(props.latLng.lng(), this.state.lngStepSize);

    console.log(`Clicked in area lat:${lat}, lng:${lng}`);
    this.setState({ selectedArea: { lat, lng } });

    const north = this.roundToPrecision(lat + (this.state.latStepSize / 2), 3);
    const south = this.roundToPrecision(lat - (this.state.latStepSize / 2), 3);
    const west = this.roundToPrecision(lng - (this.state.lngStepSize / 2), 3);
    const east = this.roundToPrecision(lng + (this.state.lngStepSize / 2), 3);

    this.props.onClickArea(north, south, west, east, this.state.activityType);

    // highlight clicked rectangle
    this.state.rectangles.forEach((r) => {
      if (r.getBounds().contains(new google.maps.LatLng(lat, lng))) {
        r.setOptions({ strokeColor: '#ff0000', strokeWeight: 4, zIndex: 999 });
      } else {
        r.setOptions({ strokeColor: '#123abc', strokeWeight: 1, zIndex: 998 });
      }
    });

    // Register Google Analytics event
    if (window.ga) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Map',
        eventAction: 'areaClick',
      });
    }
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

    // Register Google Analytics event
    if (window.ga) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Map',
        eventAction: 'centerOnMyLocation',
      });
    }
  }

  onChange(props) {
    this.setState({ bounds: props.bounds });
    this.setState({ zoom: props.zoom });

    this.drawRectangles(props.bounds, props.zoom, this.state.latStepSize, this.state.lngStepSize, this.state.selectedArea);

    // Register Google Analytics event
    if (window.ga) {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Map',
        eventAction: 'move',
      });
    }
  }

  drawRectangles(bounds, zoom, latStepSize, lngStepSize, selectedArea) {
    // Remove existing rectangles
    this.state.rectangles.forEach(r => r.setMap(null));
    this.setState({ rectangles: [] });

    if ((zoom <= 12 && this.state.gridSize === 'small') || (zoom <= 11 && this.state.gridSize === 'medium') || (zoom <= 10 && this.state.gridSize === 'large')) {
      this.setState({ showZoomMessage: true });
      return;
    }
    this.setState({ showZoomMessage: false });

    const startLat = this.round(bounds.se.lat, latStepSize);
    const startLng = this.round(bounds.nw.lng, lngStepSize);

    const endLat = this.round(bounds.nw.lat, latStepSize) + latStepSize;
    const endLng = this.round(bounds.se.lng, lngStepSize) + lngStepSize;

    let count = 0;
    for (let lat = Math.min(startLat, endLat); lat <= Math.max(startLat, endLat); lat += latStepSize) {
      for (let lng = Math.min(startLng, endLng); lng <= Math.max(startLng, endLng); lng += lngStepSize) {
        const north = lat + (latStepSize / 2);
        const south = lat - (latStepSize / 2);
        const west = lng - (lngStepSize / 2);
        const east = lng + (lngStepSize / 2);

        const selected = selectedArea && selectedArea.lat === this.round(lat, latStepSize) &&
          selectedArea.lng === this.round(lng, lngStepSize);

        this.addRectangle(north, south, west, east, selected);

        count += 1;
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

  onGridChange(e) {
    let multiplier = 1;
    switch (e.target.value) {
      case 'medium':
        multiplier = 3; break;
      case 'large':
        multiplier = 9; break;
      default:
        multiplier = 1;
    }
    const latStepSize = multiplier * this.baseLatStepSize;
    const lngStepSize = multiplier * this.baseLngStepSize;
    this.setState({ latStepSize });
    this.setState({ lngStepSize });
    this.setState({ gridSize: e.target.value });
    this.setState({ selectedArea: null });

    this.drawRectangles(this.state.bounds, this.state.zoom, latStepSize, lngStepSize, null);
  }

  onActivityTypeChange(e) {
    this.setState({ activityType: e.target.value });
  }

  render() {
    return (
      <div>
        <div className={s.search}>
          <div className={s.searchBoxWrapper}>
            <MapSearchBox onPlacesChanged={this.onPlacesChanged} placeholder="Search a location" />
          </div>
          <div className={s.findMe}>
            <button onClick={this.centerOnMyLocation} title="Find me!"><FontAwesome name="crosshairs" /></button>
          </div>
        </div>
        <div>
          <Filters onGridChange={this.onGridChange} onActivityTypeChange={this.onActivityTypeChange} />
        </div>
        {this.state.showZoomMessage && <div className={s.zoomMessage}><FontAwesome name="info-circle" /> Zoom in to select an area</div>}
        <div className={s.mapWrapper}>
          <GoogleMapReact
            onGoogleApiLoaded={({ map }) => this.setMap(map)}
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
  activityType: PropTypes.string,
};

Map.defaultProps = {
  center: { lat: 52.38, lng: 4.6462 },
  zoom: 14,
  activityType: 'both',
};

export default controllable(withStyles(s)(Map), ['center', 'zoom', 'hoverKey', 'clickKey']);
