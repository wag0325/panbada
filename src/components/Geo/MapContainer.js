import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import GoogleApiComponent from '../../utils/googleAPIHandler/GoogleApiComponent'
import Map from './Map'

class MapContainer extends Component {
  render() {
    console.log("map props ", this.props)
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <Map google={this.props.google} />
      </div>
    )
  }
}


export default GoogleApiComponent({
  apiKey: 'AIzaSyBOMmzOiZa0TPrMEqGZOh0SxdM-lEO0BHU'
})(MapContainer)