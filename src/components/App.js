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

import Header from './Header/Header'
import LoginContainer from './container/LoginContainer'
import ResetContainer from './container/ResetContainer'
import HomeContainer from './container/HomeContainer'
import UsersContainer from './container/UsersContainer'
import UserContainer from './container/UserContainer'
import MessagingContainer from './container/MessagingContainer'
import GigsContainer from './container/GigsContainer'
import GigContainer from './container/GigContainer'
import CreateGigContainer from './container/CreateGigContainer'
import SearchContainer from './container/SearchContainer'
import MyActivityContainer from './container/MyActivityContainer'
import MySettingsContainer from './container/MySettingsContainer'

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="">
          <Switch>
            <Route exact path='/' component={HomeContainer}/>
            <Route exact path='/login' component={LoginContainer}/>
            <Route exact path='/forgot' component={ResetContainer}/>
            <Route exact path='/gigs' component={GigsContainer}/>
            <Route exact path='/gigs/new' component={CreateGigContainer}/>
            <Route path='/g/:id' component={GigContainer}/>
            <Route exact path='/messaging' component={MessagingContainer}/>
            <Route path='/messaging/thread/:id' component={MessagingContainer}/>
            <Route exact path='/people' component={UsersContainer}/>
            <Route path='/u/:id' component={UserContainer}/>
            <Route path='/search/:filter' component={UsersContainer}/>
            <Route exact path='/myactivity' component={MyActivityContainer}/>
            <Route exact path='/mysettings' component={MySettingsContainer}/>
          </Switch>
        </div>
      </div>
    )
  }
}

export default App