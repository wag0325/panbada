import React, { Component } from 'react'
import gql from 'graphql-tag'
import {withRouter} from 'react-router-dom'

import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui-icons/Search'

class GigSearch extends Component {

  state = {
    keyword: '',
    location: '',
  }

  render() {
    const { users, filter } = this.state 

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
        <Input
          type='text'
          placeholder='city, state, or zip code'
          onChange={(e) => this.setState({ location: e.target.value })}
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
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state

    if ( filter ) this.props.history.push(`/search/${filter}`)
  }

}


export default GigSearch