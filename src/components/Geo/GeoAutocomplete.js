import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'

class GeoAutocomplete extends Component {
  constructor(props) {
    super(props)

    const { lat, lng } = this.props.initialCenter
    this.state = {
      autocomplete: '',
      address: '',
      currentLocation: {
        lat: lat,
        lng: lng,
      },
    }
    
    this._loadAutocomplete = this._loadAutocomplete.bind(this)    

  }

  componentDidMount() {
    console.log("props ", this.props)
    console.log("autocomplete ", this.state.autocomplete)
    this._loadAutocomplete()
  }

  render() {
    return (
      <div>
        <input 
          type='text'
          ref={e => this.autocompleteSearchInput = e}
          />
          {this.state.currentLocation.lat} {this.state.currentLocation.lng}
      </div>
    )
  }
  
  _loadAutocomplete = () => {
    if(this.props && this.props.google) {
      const { google } = this.props
      
      const autocomplete = new google.maps.places.Autocomplete(this.autocompleteSearchInput,
            {types: ['geocode']})
      
      console.log("autocomplete load", autocomplete)

      // When the user selects an address from the dropdown, populate the address
      // fields in the form.
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace()
        console.log("place ", place)
        this.setState({
          currentLocation: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
          }
        })      
      })

      this.setState({autocomplete: autocomplete})
    }
  }
  
}

GeoAutocomplete.propTypes = {
  autocomplete: PropTypes.object,
  address: PropTypes.object,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool,
}

GeoAutocomplete.defaultProps = {
  // San Francisco, by default
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  centerAroundCurrentLocation: false,
}


export default GeoAutocomplete