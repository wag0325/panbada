import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'react-router-dom'

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
        <input
          type='text'
          onChange={(e) => this.setState({ filter: e.target.value })}
        />
        <button
          onClick={() => this._executeSearch()}
        >
          OK
        </button>
      </div>
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state

    if ( filter ) this.props.history.push(`/search/${filter}`)
  }

}


export default withApollo(withRouter(SearchForm))