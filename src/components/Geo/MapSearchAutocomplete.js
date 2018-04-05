import React, { Component } from 'react'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui-icons/Search'

class MapSearchAutocomplete extends Component {

  state = {
    users: [],
    filter: ''
  }

  render() {
    const { users, filter } = this.state 
    componentDidMount() {

    }

    return (
      <div>
        <Input
          type='text'
          placeholder='Search'
          onChange={(e) => this.setState({ filter: e.target.value })}
          ref={(e) => this.setSearchInputElementReference = e}
          endAdornment={
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => this._executeSearch()}
                    aria-label="Search">
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
        />
      </div>
    )
  }

  _executeSearch = () => {
    const { filter } = this.state
    let address = filter 

    this._geocodeAddress(address)
  }
  
  _geocodeAddress = (address) => {
    this.geocoder.geocode({'address': address}, function handleResults(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        
      }
    })
  }
}


export default MapSearchAutocomplete