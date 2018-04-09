import React, { Component } from 'react'
import gql from 'graphql-tag'
import {withRouter} from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui-icons/Search'
import Button from 'material-ui/Button'

import GeoAutocompleteContainer from '../Geo/GeoAutocompleteContainer'

const styles = theme => ({
  root: {
    textAlign: 'center',
    marginBottom: 30,
  },
  searchbox: {
    width: 240,
    display: 'inline-block'
  },
})

class GigSearch extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keywords: '',
      location: {
        lat: 40.75855, 
        lng: -73.76543,
      },
      distance: 25,
    }

    this._handleGeo = this._handleGeo.bind(this)
  }

  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.searchbox} style={{width: `240px`, display: `inline-block`}}>
          <GeoAutocompleteContainer onSearchGeo={this._handleGeo}/>
        </div>
        <Button color='primary' variant='raised' onClick={() => this._executeSearch()}>Find Gigs</Button>
      </div>
    )
  }
  
  _handleGeo(places) {
    if (places.length === 0 || !places) return
    const place = places[0]

    this.setState({
      location: {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      },
    })
  }

  _executeSearch = async () => {
    const { distance, location, keywords } = this.state
    
    this.props.history.push(`/gigs?lat=${location.lat}&lng=${location.lng}&r=${distance}`)
  }
  
}


export default withStyles(styles)(withRouter(GigSearch))