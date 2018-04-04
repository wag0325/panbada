import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
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
    const pos = {lat: 37.759703, lng: -122.428093}

    console.log("map props ", this.props)
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }

    return (
      <div className={classes.root}>
        <Map google={this.props.google} />
      </div>
    )
  }
}

export default withStyles(styles)(GoogleApiComponent({
  apiKey: 'AIzaSyBOMmzOiZa0TPrMEqGZOh0SxdM-lEO0BHU'
})(MapContainer))