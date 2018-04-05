import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import GoogleApiComponent from '../../utils/googleAPIHandler/GoogleApiComponent'


const styles = theme => ({
})

class Marker extends Component {
  componentDidMount() {
    this._renderMarker()
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position)) {
        this._renderMarker()
    }
  }

  render() {
    return null
  }

  _renderMarker = () => {
    const evtNames = ['click', 'mouseover']
    let {
      map, google, position, mapCenter
    } = this.props
    
    console.log("marker props ", map, google, position, mapCenter)
    let pos = position || mapCenter
    position = new google.maps.LatLng(pos.lat, pos.lng)

    const pref = {
        map: map,
        position: position
      }
    
    this.marker = new google.maps.Marker(pref)
    console.log("marker ", this.marker)
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
}

export default withStyles(styles)(Marker)