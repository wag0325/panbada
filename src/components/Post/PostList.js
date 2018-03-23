import React, { Component } from 'react'
import Post from './Post'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'


const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
})

class PostList extends Component {
  state = {
    page: '', 
    isLoading: false,
    isError: false, 
  }
  
  render() {
    if (this.props.postFeedQuery && this.props.postFeedQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.postFeedQuery && this.props.postFeedQuery.error) {
      return <div>Error</div>
    }

    const postsToRender = this.props.postFeedQuery.postsConnection.edges

    return (
      <div>{postsToRender.map(post => <Post key={post.node.id} post={post.node} />)}</div>
    )
  }
}

export const POSTS_CONNECTION_QUERY = gql`
  query PostsConnectionQuery {
    postsConnection {
      edges {
        node {
          id
          title
          text
        }
      }
    }
  }
`
export default graphql(POSTS_CONNECTION_QUERY, { name: 'postFeedQuery' }) (PostList)