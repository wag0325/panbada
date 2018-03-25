// user component for user list
import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
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
})

class User extends Component {
  state = {
    secondary: false,
    followed: false,
    userId: '',
  }

  componentWillMount() {
    this.setState({userId: this.props.user.id})
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { secondary, followed } = this.state
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
          {followed ? (<Button variant="raised" size="small" onClick={() => this._unfollowUser()}>Unfollow</Button>) : (<Button variant="raised" size="small" onClick={() => this._followUser()}>Follow</Button>)}
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

  _followUser = async () => {
    const id = this.props.user.id
    await this.props.followMutation({
      variables: {
        id
      },
      update: (store, {data: {follow}}) => {
        this.setState({ followed: true })
      },
    })
  }

  _unfollowUser = async () => {
    const id = this.props.user.id
    await this.props.unfollowMutation({
      variables: {
        id
      },
      update: (store, {data: {unfollow}}) => {
        this.setState({ followed: false })
      },
    })
  }
}

const FOLLOW_MUTATION = gql`
  mutation FollowMutation($id: ID!) {
    follow(id: $id) {
      id
    }
  }
`

const UNFOLLOW_MUTATION = gql`
  mutation UnfollowMutation($id: ID!) {
    unfollow(id: $id) {
      id
    }
  }
`

export default withStyles(styles)(compose(
  graphql(FOLLOW_MUTATION, {name: 'followMutation',}),
  graphql(UNFOLLOW_MUTATION, {name: 'unfollowMutation',})
)(User))