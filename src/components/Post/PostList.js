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

    const postsToRender = this.props.postFeedQuery.postFeed

    return (
      <div>{postsToRender.map(post => <Post key={post.id} post={post} />)}</div>
    )
  }
}

export const POST_FEED_QUERY = gql`
  query PostFeedQuery{
    postFeed {
      id
      title
      text
      createdAt
      pictureURL
      postedBy {
        firstName
        lastName
        avatarURL
        id
      } 
      postComments {
        text
      }
    }
  }
`

export const POSTS_CONNECTION_QUERY = gql`
  query PostsConnectionQuery($after: String, $orderBy: PostOrderByInput, $where: PostWhereInput) {
    postsConnection(after: $after, first: 5, orderBy: $orderBy, where: $where) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          title
          text
          createdAt
          pictureURL
          postedBy {
            firstName
            lastName
            avatarURL
            id
          } 
          postComments {
            text
          }
        }
      }
    }
  }
`
export default graphql(POST_FEED_QUERY, { name: 'postFeedQuery' }) (PostList)