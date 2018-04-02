import React, { Component } from 'react'
import Post from './Post'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'

import { PostFragments, UserFragments } from '../../constants/gqlFragments'
import { POSTS_PER_PAGE, POSTS_ORDER_BY } from '../../constants'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing.unit,
  },
  loadMoreWrapper: {
    margin: 5,
    textAlign: 'center',
  },
})

class PostList extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      page: '', 
      isLoading: false,
      isError: false, 
      hasMoreItems: true,
      hasNextPage: true,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    console.log("nextProps ", nextProps)
    const { hasNextPage } = nextProps.postFeedQuery.postsConnection.pageInfo
    this.setState({hasNextPage: hasNextPage })
  }
  componentWillMount() {
    document.addEventListener('scroll', this._trackScrolling)
  }
  
  componentWillUnmount() {
    document.removeEventListener('scroll', this._trackScrolling)
  }

  render() {
    if (this.props.postFeedQuery && this.props.postFeedQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.postFeedQuery && this.props.postFeedQuery.error) {
      return <div>Error</div>
    }
    
    console.log("this.props", this.props)
    const { classes } = this.props
    const { postsConnection } = this.props.postFeedQuery
    const postsToRender = postsConnection.edges

    return (
      <div id='post-feed-wrapper'>{postsToRender.map((post, index) =>
          <Post key={post.node.id} index={index} post={post.node} />
          )}
        {this.state.hasNextPage && 
          <div className={classes.loadMoreWrapper}><Button variant="raised" className={classes.button} onClick={this._loadMoreRows}>
            Load More
          </Button></div>
        }
      </div>
         )
  }
  
  _trackScrolling = () => {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      console.log("reached bottom", windowHeight, window.pageYOffset, windowBottom, docHeight)
      this._loadMoreRows()
    } else {
      console.log("not yet", windowHeight, window.pageYOffset, windowBottom, docHeight)
    }
  }

  _loadMoreRows = () => {
    const { postsConnection, fetchMore } = this.props.postFeedQuery
    fetchMore({
      variables: { after: postsConnection.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {

        if (!fetchMoreResult) {
          return false
        }

        const prevPostFeed = previousResult.postsConnection.edges
        const newPostFeed =
          fetchMoreResult.postsConnection.edges

        const newPostsData = {...fetchMoreResult.postsConnection, 
          edges: [
            ...prevPostFeed,
            ...newPostFeed,
          ]}

        const newData = {
          ...previousResult,
          postsConnection: newPostsData
        }
        
        return newData
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
          ...PostBasic
          postLikes {
            ...PostLike
          }
          postBookmarks {
            ...PostBookmark
          }
          postedBy {
            ...Avatar
          }
          postComments {
            ...PostComment
          }
        }
      }
      aggregate {
        count
      }
    }
  }
  ${PostFragments.postBasic}
  ${PostFragments.postComment}
  ${PostFragments.postLike}
  ${PostFragments.postBookmark}
  ${UserFragments.avatar}
`

export default withStyles(styles)(graphql(POST_FEED_QUERY, { 
  name: 'postFeedQuery',
  options: ownProps => {
    let after = ownProps.endCursor || null
    let postById = ownProps.postById || null
    return {
      variables: { first: POSTS_PER_PAGE, after:after, orderBy: POSTS_ORDER_BY, filter: postById }
    }
  },
})(PostList))