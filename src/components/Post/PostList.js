import React, { Component } from 'react'
import Post from './Post'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { InfiniteLoader, List } from 'react-virtualized'
import 'react-virtualized/styles.css'
import InfiniteScroll from 'react-infinite-scroller'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'

import { POSTS_PER_PAGE, POSTS_ORDER_BY } from '../../constants'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
})

let postData = []
let postArrEndCursor = ''
let postArrStartCursor = ''

class PostList extends Component {
  state = {
    page: '', 
    isLoading: false,
    isError: false, 
    hasMoreItems: true,
    hasNextPage: true,
  }
  
  // componentWillMount() {
  //   document.addEventListener('scroll', this._trackScrolling)
  // }
  
  // componentWillUnmount() {
  //   document.removeEventListener('scroll', this._trackScrolling)
  // }

  render() {
    if (this.props.postFeedQuery && this.props.postFeedQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.postFeedQuery && this.props.postFeedQuery.error) {
      return <div>Error</div>
    }
    
    const { postsConnection } = this.props.postFeedQuery
    console.log("postFeedQuery ", this.props.postFeedQuery)
    console.log("postsConnection ", postsConnection)
    if (postsConnection) {
      const endCursor = postsConnection.pageInfo.endCursor
      const startCursor = postsConnection.edges[0].node.id
      if (this.props.postFeedQuery.postsConnection.pageInfo.hasNextPage === false
          && this.state.hasNextPage === true) {
        this.setState({ hasNextPage: false })  
      }

      if (endCursor !== postArrEndCursor ) {
        postArrStartCursor = postsConnection.edges[0].node.id
        this.props.postFeedQuery.postsConnection.edges.map((edge) => {
          postData.push(edge.node)
          postArrEndCursor = edge.node.id
        })
      }
      
      // Created a new post
      if (startCursor !== postArrStartCursor) {
        postArrStartCursor = postsConnection.edges[0].node.id
        postData.splice(0, 0, postsConnection.edges[0].node)
      }
    }

    return (
      <div id='post-feed-wrapper'>{postData.map((post, index) =>
          <Post key={post.id} index={index} post={post} />
          )}
        {this.state.hasNextPage && <button onClick={this._loadMoreRows}>Load More</button>}
      </div>
         )
  }
  
  _trackScrolling = () => {
    const postFeedDiv = document.getElementById('post-feed-wrapper').offsetHeight
  }

  _loadMoreRows = () => {
    const { postsConnection, fetchMore } = this.props.postFeedQuery
    fetchMore({
      variables: { after: postsConnection.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        if (!fetchMoreResult) {
          console.log("no more data from fetchmore")
          return false
        }

        const prevResult = previousResult.postsConnection.edges
        const newResult =
          fetchMoreResult.postsConnection.edges
        const pageInfo =
          fetchMoreResult.postsConnection.pageInfo
        const aggregate = previousResult.postsConnection.aggregate.count
        
        return {
          postsConnection: {
            aggregate,
            edges: newResult,
            pageInfo,
          }
        }
      },
    })
  }
}

export const POST_FEED_QUERY = gql`
  query PostsConnectionQuery($first: Int, $after: String, $orderBy: PostOrderByInput) {
    postsConnection(first: $first, after: $after, orderBy: $orderBy,) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          createdAt
          title
          text
          pictureURL
          postedBy {
            id
            firstName
            lastName
            avatarURL
          }
          postComments {
            id
            text
            user {
              id
              firstName
              lastName
              avatarURL
            }
          }
        }
      }
      aggregate {
        count
      }
    }
  }
`
export default graphql(POST_FEED_QUERY, { 
  name: 'postFeedQuery',
  options: ownProps => {
    let after = ownProps.endCursor || null
    return {
      variables: { first: POSTS_PER_PAGE, after:after, orderBy: POSTS_ORDER_BY }
    }
  },
}) (PostList)