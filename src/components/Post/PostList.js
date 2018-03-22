import React, { Component } from 'react'
import Post from './Post'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';

import { POSTS_PER_PAGE } from '../../constants'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
});

class PostList extends Component {
  state = {
    page: '', 
    isLoading: false,
    isError: false, 
  }
  
  // Reached end of the page? 
  // componentDidMount() {
  //   window.addEventListener('scroll', this._onScroll, false)
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this._onScroll, false)
  // }

  render() {
    if (this.props.postFeedQuery && this.props.postFeedQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
        )
    }
    
    if (this.props.postFeedQuery && this.props.postFeedQuery.error) {
      return <div>Error</div>
    }

    // const postsToRender = this.props.postFeedQuery.postFeed
    // const page = parseInt(this.props.match.params.page, 10)
    
    const isNewPage = this.props.location.pathname.includes('new')
    const postsToRender = this._getPostsToRender(isNewPage)
    const page = parseInt(this.props.match.params.page, 10)


    return (
      <div>
        <div>{postsToRender.map((post, index) =>
          <Post key={post.id} index={index} post={post} page={page} updateStoreAfterPostLike={this._updateCacheAfterPostLike} />
          )}
        </div>
        {isNewPage &&
        <div className='flex ml4 mv3 gray'>
          <div className='pointer mr2' onClick={() => this._previousPage()}>Previous</div>
          <div className='pointer' onClick={() => this._nextPage()}>Next</div>
        </div>}
      </div>
    )
  }
  
  _getPostsToRender = (isNewPage) => {
    if (isNewPage) {
      return this.props.postFeedQuery.postFeed
    }
    const rankedPosts = this.props.postFeedQuery.postFeed.slice()
    rankedPosts.sort((l1, l2) => l2.postLikes.length - l1.postLikes.length)
    return rankedPosts
  }

  _nextPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page <= this.props.postFeedQuery.postFeed.length / POSTS_PER_PAGE) {
      const nextPage = page + 1
      this.props.history.push(`/new/${nextPage}`)
    }
  }

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10)
    if (page > 1) {
      const previousPage = page - 1
      this.props.history.push(`/new/${previousPage}`)
    }
  }

  // _onScroll = () => {
  //   if (
  //     (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) &&
  //     this.props.list.length
  //     ) {
  //     this._handleEnd()
  //   }
  // }
  
  _handleEnd = () => {
    console.log("_handleEnd")
    // this.setState( state => {page: state.page + 1}, () => this.fetchData())
    // fetchMore({
    //   variables: {
    //     skip: this.props.postFeedQuery.postFeed.length
    //   },
    //   updateQuery: (previousResult, { fetchMoreResult }) => {
    //     if (!fetchMoreResult) {
    //       return previousResult;
    //     }
    //     return Object.assign({}, previousResult, {
    //       postFeed: [...previousResult.postFeedQuery.postFeed, ...fetchMoreResult.postFeedQuery.postFeed],
    //     })
    //   },
    // })
  }

  _updateCacheAfterPostLike = (store, createPostLike, postId) => {
    const isNewPage = this.props.location.pathname.includes('new')
    const page = parseInt(this.props.match.params.page, 10)
    const skip = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0
    const first = isNewPage ? POSTS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null

    const data = store.readQuery({ query: POST_FEED_QUERY, variables: { first, skip, orderBy } })

    const likedPost = data.postFeed.find(post => post.id === postId)
    likedPost.postLikes = createPostLike.post.postLikes

    store.writeQuery({ query: POST_FEED_QUERY, data, variables: { first, skip, orderBy }})
  }
}

export const POST_FEED_QUERY = gql`
  query PostFeedQuery($first: Int, $skip: Int, $orderBy: PostOrderByInput) {
    postFeed(first: $first, skip: $skip, orderBy: $orderBy) {
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

export default withStyles(styles)(graphql(POST_FEED_QUERY, {
  name: 'postFeedQuery',
  options: ownProps => {
    const page = parseInt(ownProps.match.params.page, 10)
    const isNewPage = ownProps.location.pathname.includes('new')
    const skip = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0
    const first = isNewPage ? POSTS_PER_PAGE : 100
    const orderBy = isNewPage ? 'createdAt_DESC' : null
    return {
      variables: { first, skip, orderBy },
    }
  },
  // props: (props) => ({
  //   props,
  //   loadMorePosts: () => {
  //     return props.data.fetchMore({
  //       variables: {
  //         skip: props.data.postFeed.length
  //       },
  //       updateQuery: (previousResult, { fetchMoreResult }) => {
  //         if (!fetchMoreResult) {
  //           return previousResult
  //         }
  //         return Object.assign({}, previousResult, {
  //           // Append the new posts results to the old one
  //           postFeed: [...previousResult.postFeed, ...fetchMoreResult.postFeed]
  //         })
  //       }
  //     })
  //   }
  // }),
})(PostList))