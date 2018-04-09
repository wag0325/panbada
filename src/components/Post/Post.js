import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import classnames from 'classnames';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import FavoriteBorderIcon from 'material-ui-icons/FavoriteBorder'
import BookmarkIcon from 'material-ui-icons/Bookmark'
import BookmarkBorderIcon from 'material-ui-icons/BookmarkBorder'
import ChatBubbleIcon from 'material-ui-icons/ChatBubble'
import ChatBubbleOutlineIcon from 'material-ui-icons/ChatBubbleOutline'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import List from 'material-ui/List'

import { AUTH_TOKEN, ME_ID, AVATAR_DEFAULT } from '../../constants'
import { timeDifferenceForDate } from '../../utils'

import PostComment from './PostComment'
import CreatePostComment from './CreatePostComment'
import { POST_FEED_QUERY } from './PostList'

const styles = theme => ({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  card: {
    marginBottom: 7,
  },
  media: {
    height: 300,
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  bookmark: {
    marginLeft: 'auto',
  },
})

const meId = localStorage.getItem(ME_ID)

class Post extends Component {
  constructor(props) {
    super(props)
    let bookmarkPostId = null
    let likePostId = null
    
    props.post.postBookmarks.filter(bookmark => {
      if (bookmark.user.id === meId) {
        bookmarkPostId = bookmark.id 
      }
      return null
    })

    props.post.postLikes.filter(like => {
      if (like.user.id === meId) {
        likePostId = like.id 
      }
      return null
    })

    this.state = {
      expanded: false, 
      dense: true,
      likePostId: likePostId,
      postLikeNum: props.post.postLikes.length || 0,
      bookmarkPostId: bookmarkPostId,
    }
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    const { classes, post } = this.props
    const { dense, bookmarkPostId, likePostId, postLikeNum } = this.state
    const commentsToRender = post.postComments

    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label={`${post.postedBy.firstName}-${post.postedBy.lastName}`} 
              className={this.props.avatar} 
              src={post.postedBy.avatarURL || AVATAR_DEFAULT} />
            }
            action={
              <IconButton>
              </IconButton>
            }
            title={post.postedBy ? `${post.postedBy.firstName} ${post.postedBy.lastName}` : 'Unknown'}
            subheader={timeDifferenceForDate(post.createdAt)}
          />
          {post.pictureURL && <CardMedia
            className={classes.media}
            image={post.pictureURL}
            title=""/>
          }
          <CardContent>
            <Typography component="p">
             {post.text}
            </Typography>
            <Typography className={this.props.pos}>
              {postLikeNum} likes {' '}
              {post.postComments && (<a onClick={this._handleExpandClick}>{this.props.post.postComments.length} comments</a>)}
            </Typography>
          </CardContent>
          <CardActions className={this.props.actions} disableActionSpacing>
            <IconButton 
              aria-label='Add to favorites'
              onClick={this._handleLike}
            >
              {likePostId ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
            </IconButton>
            <IconButton
              className={classnames(this.props.expand, {
                [this.props.expandOpen]: this.state.expanded,
              })}
              onClick={this._handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            > 
              <ChatBubbleOutlineIcon />
            </IconButton>
            <IconButton aria-label="save"
              onClick={this._handleBookmark}
              className={classes.bookmark}
            >
              {bookmarkPostId ? <BookmarkIcon /> : <BookmarkBorderIcon /> } 
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {authToken && (<CreatePostComment id={this.props.post.id} page={this.props.page}/>)}
              <List dense={dense}>
                {commentsToRender.map((postComment, index) => 
                  <PostComment key={postComment.id} index={index} postComment={postComment} />)}
              </List>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    )
  }
  
  _handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  
  _handleBookmark = async () => {
    const id = this.props.post.id
    const { bookmarkPostId } = this.state

    if (bookmarkPostId) {
      await this.props.unbookmarkPostMutation({
        variables: {
          id: bookmarkPostId
        }, 
        update: (store, {data: { bookmarkPost }}) => {          
          this.setState({bookmarkPostId: null})
        },
      })
    } else {
      await this.props.bookmarkPostMutation({
        variables: {
          id
        },
        update: (store, {data: { bookmarkPost }}) => {
          this.setState({bookmarkPostId: bookmarkPost.id})
        },
      })
    }
  }

  _handleLike = async () => {
    const id = this.props.post.id
    const { likePostId, postLikeNum } = this.state

    if (likePostId) {
      await this.props.unlikePostMutation({
        variables: {
          id: likePostId
        }, 
        update: (store, {data: { unlikePost }}) => {
          this.setState({likePostId: null, postLikeNum: postLikeNum - 1})
        },
      })
    } else {
      await this.props.likePostMutation({
        variables: {
          id
        },
        update: (store, {data: { likePost }}) => {
          this.setState({likePostId: likePost.id, postLikeNum: postLikeNum + 1})
        },
      })
    }
  }
}

const LIKE_POST_MUTATION = gql`
  mutation LikePostMutation($id: ID!) {
    likePost(id: $id) {
      id
      post {
        id
        postLikes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

const UNLIKE_POST_MUTATION = gql`
  mutation UnlikePostMutation($id: ID!) {
    unlikePost(id: $id) {
      id
    }
  }
`

const BOOKMARK_POST_MUTATION = gql`
  mutation BookmarkPostMutation($id: ID!) {
    bookmarkPost(id: $id) {
      id
    }
  }
`

const UNBOOKMARK_POST_MUTATION = gql`
  mutation UnbookmarkPostMutation($id: ID!) {
    unbookmarkPost(id: $id) {
      id
    }
  }
`

export default withStyles(styles)(compose(
  graphql(LIKE_POST_MUTATION, { name: 'likePostMutation' }),
  graphql(UNLIKE_POST_MUTATION, { name: 'unlikePostMutation' }),
  graphql(BOOKMARK_POST_MUTATION, { name: 'bookmarkPostMutation' }),
  graphql(UNBOOKMARK_POST_MUTATION, { name: 'unbookmarkPostMutation' }),
)(Post))