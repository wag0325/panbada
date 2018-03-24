import React, { Component } from 'react'
import Post from './Post'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { InfiniteLoader, List } from 'react-virtualized'
import 'react-virtualized/styles.css'


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

let postData = []

class PostList extends Component {
  state = {
    page: '', 
    isLoading: false,
    isError: false, 
  }
  
  componentDidUpdate() {
    // this._rowRenderer()
  }

  render() {
    if (this.props.postFeedQuery && this.props.postFeedQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.postFeedQuery && this.props.postFeedQuery.error) {
      return <div>Error</div>
    }
    
    console.log("data ", this.props)
    const remoteRowCount = this.props.postFeedQuery.postsConnection.aggregate.count
    // const remoteRowCount = 3
    postData = this.props.postFeedQuery.postsConnection.edges
    console.log("postData ", postData)
    return (
      <InfiniteLoader
        isRowLoaded={this._isRowLoaded}
        loadMoreRows={this._loadMoreRows}
        rowCount={remoteRowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <List
            height={40}
            onRowsRendered={onRowsRendered}
            ref={registerChild}
            rowCount={remoteRowCount}
            rowHeight={100}
            rowRenderer={this._rowRenderer}
            width={300}
          />
        )}
      </InfiniteLoader>
    )
  }

  _isRowLoaded = ({index}) => {
    return !!postData[index]
  }

  _rowRenderer = ({key, index, style }) => {
    console.log(key)
    console.log("index", index)
    console.log("posts", postData.length)
    console.log(postData[index])
    let content
    if ( index < postData.length) {
      const post = postData[index].node
      return (
        <div>{post.title}</div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }

  _loadMoreRows = () => {
    console.log("loadMoreRows")
    const { postsConnection, fetchMore } = this.props.postFeedQuery
    console.log("last ", postsConnection.pageInfo.endCursor)
    fetchMore({
      variables: { after: postsConnection.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        const prevResult =
          previousResult.postsConnection.edges
        const newResult =
          fetchMoreResult.postsConnection.edges
        const pageInfo =
          fetchMoreResult.postsConnection.pageInfo
        const aggregate = previousResult.postsConnection.aggregate.count
        return {
          postsConnection: {
            aggregate,
            edges: [...prevResult, ...newResult],
            pageInfo,
          }
        }
      },
    })
  }
}

export const POST_FEED_QUERY = gql`
  query PostsConnectionQuery($first: Int, $after: String) {
    postsConnection(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          title
          text
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
      variables: { first: 3, after:after }
    }
  },
}) (PostList)