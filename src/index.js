import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BrowserRouter } from 'react-router-dom'

import { AUTH_TOKEN } from './constants'
import { ApolloLink } from 'apollo-link'

const httpLink = new HttpLink({ uri: 'http://ec2-34-238-136-4.compute-1.amazonaws.com:8000/graphql' })

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    }
  }
})

ReactDOM.render(
  <BrowserRouter>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  </BrowserRouter>
  , document.getElementById('root')
)