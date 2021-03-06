import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'

import { GOOGLE_MAP_ACCESS_KEY } from '../../constants/config'
import GoogleApiComponent from '../../utils/googleAPIHandler/GoogleApiComponent'

import Map from './Map'
import Marker from './Marker'

const styles = theme => ({
  map: {
    width: '100vw',
    height: '100vh'
 },
})

class MapContainer extends Component {
  render() {
    const { classes } = this.props
    // const pos = {lat: 37.759703, lng: -122.428093}
    const pos = this.props.pos || {lat: 37.759703, lng: -122.428093}

    console.log("map props ", this.props)
    if (!this.props.loaded && this.props.google) {
      return <div>Loading...</div>
    }

    return (
      <div className={classes.root}>
        <Map google={this.props.google} pos={pos}>
          <Marker position={pos} />
        </Map>
      </div>
    )
  }
}

export default withStyles(styles)(GoogleApiComponent({
  apiKey: GOOGLE_MAP_ACCESS_KEY,
  libraries: ['places', 'visualization'],
})(MapContainer))