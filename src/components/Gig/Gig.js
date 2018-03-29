import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import { timeDifferenceForDate } from '../../utils'

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
})

class Gig extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { gig } = this.props
    const user = gig.postedBy

    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar aria-label={`${user.firstName}-${user.lastName}`}
              className={this.props.avatar} 
              src={user.avatarURL || AVATAR_DEFAULT}
          />
        </ListItemAvatar>
        <Link to={`/g/${gig.id}`}><ListItemText
          primary={this.props.gig.title}
          secondary={timeDifferenceForDate(this.props.gig.createdAt)}
        /></Link>
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
})(Gig))