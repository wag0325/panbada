import React, {Component} from 'react'
import { compose, withProps } from 'recompose'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps'

import { GOOGLE_MAP_ACCESS_KEY } from '../../constants/config'

const MyMapComponent = withScriptjs(withGoogleMap((props) => {
  console.log("props pos", props)
  const pos = props.pos || { lat: -34.397, lng: 150.644 }
  return (<GoogleMap
    defaultZoom={14}
    defaultCenter={pos}
  >
    {props.isMarkerShown && <Marker position={pos} />}
  </GoogleMap>)
}))


class MapContainer extends Component {
  state = {
    isMarkerShown: false,
  }

  componentDidMount() {
    this.delayedShowMarker()
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {
    return (
      <MyMapComponent
        pos={this.props.pos}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_ACCESS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    )
  }
}

export default MapContainer