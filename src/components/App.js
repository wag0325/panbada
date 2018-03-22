import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import Header from './Header'
import Login from './Login'
import PostList from './Post/PostList'
import CreatePost from './Post/CreatePost'
import UserList from './User/UserList'
import UserDetails from './User/UserDetails'
import UpdateMe from './User/UpdateMe'
import GigList from './Gig/GigList'
import GigDetails from './Gig/GigDetails'
import CreateGig from './Gig/CreateGig'

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="">
          <Switch>
            <Route exact path='/' component={PostList}/>
            <Route exact path='/login' component={Login}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default App