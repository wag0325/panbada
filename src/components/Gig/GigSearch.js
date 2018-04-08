import React, { Component } from 'react'
import gql from 'graphql-tag'
import {withRouter} from 'react-router-dom'

import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui-icons/Search'

import GeoAutocompleteContainer from '../Geo/GeoAutocompleteContainer'

class GigSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keyword: '',
      location: {
        lat: 40.75855, 
        lng: -73.76543,
      },
      distance: 25,
    }
  }

  render() {
    return (
      <div>
        <Input
          type='text'
          placeholder='title, keywords, or company'
          onChange={(e) => this.setState({ keyword: e.target.value })}
          endAdornment={
                <InputAdornment position='end'>
                  <IconButton 
                    onClick={() => this._executeSearch()}
                    aria-label='Search'>
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
        />
        <GeoAutocompleteContainer />
        <button variant='primary' onClick={() => this._executeSearch()}>Find Gigs</button>
      </div>
    )
  }

  _executeSearch = async () => {
    const { distance, location } = this.state
    
    this.props.history.push(`/gigs?lat=${location.lat}&lng=${location.lng}&r=${distance}`)
  }
  
}


export default withRouter(GigSearch)