import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import { camelize } from '../../utils/stringFunctions'

const styles = theme => ({
  map: {
    height: 400,
    width: '100%',
  },
})

class Map extends Component {
  constructor(props) {
    super(props)
    
    const { lat, lng } = this.props.initialCenter
    this.state ={
      currentLocation: {
        lat: lat,
        lng: lng,
      },
    }
  }

  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = pos.coords
                this.setState({
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    }
                })
            })
        }
    }
    this._loadMap()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) this._loadMap()
    if (prevState.currentLocation !== this.state.currentLocation) this._recenterMap()
  }
  
  render() {
    const { classes } = this.props 
    const { currentLocation } = this.state

    return (
      <div>
        <div>
          {currentLocation.lat} / {currentLocation.lng}
        </div>
        <div ref={e => this.mapElement = e} className={classes.map}>
          Loading map...
        </div>
      </div>
    )
  }

  _loadMap = () => {
    if(this.props && this.props.google) {
      const { google, zoom } = this.props
      const { lat, lng } = this.state.currentLocation
      const maps = google.maps 
      

      const center = new maps.LatLng(lat, lng)
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      })
      
      this.map = new maps.Map(this.mapElement, mapConfig)

      const evtNames = ['ready', 'click', 'dragend']

      evtNames.forEach(e => {
        this.map.addListener(e, this._handleEvent(e))
      })

      maps.event.trigger(this.map, 'ready')
    }
  }
  
  _handleEvent = (evtName) => {
    let timeout
    const handlerName = `on${camelize(evtName)}`

    return (e) => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(() => {
        if (this.props[handlerName]) {
          this.props[handlerName](this.props, this.map, e)
        }
      }, 0)
    }
  }

  _recenterMap = () => {
    const map = this.map
    const curr = this.state.currentLocation

    const google = this.props.google
    const maps = google.maps

    if (map) {
        let center = new maps.LatLng(curr.lat, curr.lng)
        map.panTo(center)
    }
  }

  _renderChildren = () => {
    const { children } = this.props
    if (!children) return

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation,
      })
    })
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool,
}

Map.defaultProps = {
  zoom: 13,
  // San Francisco, by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  centerAroundCurrentLocation: false,
}


export default withStyles(styles)(Map)