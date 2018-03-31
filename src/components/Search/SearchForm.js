import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'react-router-dom'

import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import IconButton from 'material-ui/IconButton'
import Search from 'material-ui-icons/Search'

import User from '../User/User'
import SearchContainer from '../container/SearchContainer'

class SearchForm extends Component {

  state = {
    users: [],
    filter: ''
  }

  render() {
    const { users, filter } = this.state 

    return (
      <div>
        <Input
          type='text'
          onChange={(e) => this.setState({ filter: e.target.value })}
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

  _executeSearch = async () => {
    const { filter } = this.state

    if ( filter ) this.props.history.push(`/search/${filter}`)
  }

}


export default withApollo(withRouter(SearchForm))