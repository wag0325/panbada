// user component for user list
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'

import { AUTH_TOKEN } from '../../constants'

const styles = theme => ({
  card: {
    minWidth: 275,
  },
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
});

class User extends Component {
  state = {
    secondary: false,
  };

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { secondary } = this.state
    const { user } = this.props

    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar aria-label={`${user.firstName}-${user.lastName}`}
              className={this.props.avatar} 
              src={user.avatar_url}
          >{user.firstName.substring(0,1)}</Avatar>
        </ListItemAvatar>
        <Link to={`/u/${user.id}`}><ListItemText
          primary={`${user.firstName} ${user.lastName}`}
          secondary={secondary ? 'Secondary text' : null}
        /></Link>
        <ListItemSecondaryAction>
          <IconButton aria-label="Delete">
          </IconButton>
          <Button variant="raised" size="small" onClick={() => this._connectUser()}>Follow</Button>
        </ListItemSecondaryAction>
      </ListItem>
    )
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

export default withStyles(styles)(graphql(POST_LIKE_MUTATION, {
  name: 'postLikeMutation',
})(User))