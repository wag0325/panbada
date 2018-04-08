import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import { camelize } from '../../utils/stringFunctions'

const styles = theme => ({
})

const evtNames = [
  'click',
  'mouseover',
]

class Marker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      marker: null,
    }
  }
  
  componentDidMount() {
    if (this.props.map && this.props.google) this._renderMarker()
  }

  componentWillUnmount() {
    if (this.state.marker) {
      this.state.marker.setMap(null)
    }
  }

  componentDidUpdate(prevProps) {
    if ((this.props.map !== prevProps.map) ||
      (this.props.position !== prevProps.position)) {
      if (this.props.map && this.props.google) this._renderMarker()
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
    
    this.setState({marker: this.marker})

    evtNames.forEach(e => {
      this.marker.addListener(e, this._handleEvent(e))
    })
  }

  _handleEvent = (evtName) => {
    return (e) => {
      const evtName = `on${camelize(e)}`
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.state.marker, e)
      }
      console.log("marker props ", this.props)
    }
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
}

export default withStyles(styles)(Marker)