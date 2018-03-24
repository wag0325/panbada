import React, { Component } from 'react'
import { graphql } from 'react-apollo'
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
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import List from 'material-ui/List';

import { AUTH_TOKEN } from '../../constants'
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
    maxWidth: 400,
  },
  media: {
    height: 194,
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
  avatar: {
    backgroundColor: red[500],
  },
});

class Post extends Component {
  state = { expanded: false, dense: true }

  render() {
    const { classes } = this.props
    const { dense } = this.state
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const post = this.props.post
    const commentsToRender = post.postComments
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" 
              className={this.props.avatar} 
              src={post.postedBy.avatarURL || ''}>
              {post.postedBy.firstName.substring(0,1)}
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={post.postedBy ? post.postedBy.firstName : "Unknown"}
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
              {post.postLikes && post.postLikes.length} likes {' '}
              {post.postComments && (<a onClick={this._handleExpandClick}>{this.props.post.postComments.length} comments</a>)}
            </Typography>
          </CardContent>
          <CardActions className={this.props.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <IconButton
              className={classnames(this.props.expand, {
                [this.props.expandOpen]: this.state.expanded,
              })}
              onClick={this._handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            > 
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              {authToken && (<CreatePostComment postId={this.props.post.id} page={this.props.page}/>)}
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

  _likePost = async () => {
    const postId = this.props.post.id
    await this.props.postLikeMutation({
      variables: {
        postId
      },
      update: (store, {data: {postLike}}) => {
        this.props.updateStoreAfterPostLike(store, postLike, postId)
      },
    })
  }
}

const POST_LIKE_MUTATION = gql`
  mutation PostLikeMutation($postId: ID!) {
    postLike(postId: $postId) {
      id
      post {
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

export default graphql(POST_LIKE_MUTATION, {
  name: 'postLikeMutation',
})(withStyles(styles)(Post))