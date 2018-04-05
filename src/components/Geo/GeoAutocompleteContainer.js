import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'

import { GOOGLE_MAP_ACCESS_KEY } from '../../constants/config'
import GoogleApiComponent from '../../utils/googleAPIHandler/GoogleApiComponent'

import GeoAutocomplete from './GeoAutocomplete'

const styles = theme => ({
  map: {
    width: '100vw',
    height: '100vh'
 },
})

class GeoAutocompleteContainer extends Component {
  render() {
    const { classes } = this.props
    
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <GeoAutocomplete google={this.props.google} />
      </div>
    )
  }
}

export default withStyles(styles)(GoogleApiComponent({
  apiKey: GOOGLE_MAP_ACCESS_KEY,
  libraries: ['places', 'visualization'],
})(GeoAutocompleteContainer))