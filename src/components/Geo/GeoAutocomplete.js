import React, { Component } from 'react'

class GeoAutocomplete extends Component {
  componentDidMount() {
    this._loadAutocomplete()
  }

  render() {
    return (
      <div>
        <input 
          type='text'
          ref={e => this.autocompleteSearchInput = e}
          onChange={(e) => this.setState({ location: e.target.value })}
          />
      </div>
    )
  }

  _executeSearch = () => {
    const { filter } = this.state
    let address = filter 

    this._geocodeAddress(address)
  }
  
  _loadAutocomplete = () => {
    if(this.props && this.props.google) {
      const { google } = this.props

      const autocomplete = new google.maps.places.Autocomplete(this.autocompleteSearchInput,
            {types: ['geocode']})
    }
  }
}


export default GeoAutocomplete