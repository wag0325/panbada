import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'

const styles = theme => ({
  map: {
    height: 400,
    width: '100%',
  },
})

class Map extends Component {
  componentDidMount() {
    this._loadMap()
  }

  componentDidUpdate(prevProps, pervState) {
    if (prevProps.google !== this.props.google) this._loadMap()
  }
  
  render() {
    const { classes } = this.props 

    return (
      <div>
        <div ref={e => this.mapElement = e} className={classes.map}>
          Loading map...
        </div>
      </div>
    )
  }

  _loadMap = () => {
    if(this.props && this.props.google) {
      const { google } = this.props
      const maps = google.maps 

      let zoom = 14
      let lat = 37.774929
      let lng = -122.419416
      const center = new maps.LatLng(lat, lng)
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      this.map = new maps.Map(this.mapElement, mapConfig)
    }
  }
}




export default withStyles(styles)(Map)