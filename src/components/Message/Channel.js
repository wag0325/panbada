// user component for user list
import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import {withRouter} from 'react-router-dom'

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

import { timeDifferenceForDate } from '../../utils'
import { AUTH_TOKEN, ME_ID, AVATAR_DEFAULT } from '../../constants'

const styles = theme => ({
  root: {
    padding: 0,
  }, 
  rootActive: {
    padding: 0,
    borderLeft: '5px solid',
    borderColor: theme.palette.primary.main,
  },
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
  datetime: {
    fontSize: 13,
    color: theme.palette.text.secondary,
  },
})

class Channel extends Component {
  state = {
    id: '',
  }
  componentWillReceiveProps(nextProps){
    // const { user } = nextProps
    // const { me } = nextProps.meQuery 
  
    // if (me && user) {      
    //   me.follows.map(follow => {
    //     if (follow.id === user.id) {
    //       this.setState({following: true})
    //       return false
    //     }
    //   })
    // }
  }


  // componentWillMount() {
  //   this.setState({userId: this.props.user.id})
  // }

  render() {
    const { classes, channel, currChannel } = this.props
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const meId = localStorage.getItem(ME_ID)
    let activeChannel = false
    
    // Only one recipient
    const users = channel.users.filter(user => 
        user.id !== meId )
    const user = users[0]

    if (!this.state.id) {
      this.setState({id: user.id})
    }

    const lastMessage = channel.messages[this.props.channel.messages.length-1]
    
    if (user.id === currChannel) {
      console.log("it's current channcle")
      activeChannel = true 
    }

    return (
      <ListItem className={activeChannel ? classes.rootActive : classes.root } onClick={this._clickChannel}>
        <ListItemAvatar>
          <Avatar aria-label={`${user.firstName}-${user.lastName}`}
              className={this.props.avatar} 
              src={user.avatarURL || AVATAR_DEFAULT}
          />        
        </ListItemAvatar>
        <ListItemText
          primary={`${user.firstName} ${user.lastName}`}
          secondary={`${lastMessage.from.firstName}: ${lastMessage.text}`}
        />
        <ListItemSecondaryAction>
          <div className={classes.datetime}>{timeDifferenceForDate(lastMessage.createdAt)}</div>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
  
  _clickChannel = () => {
    const { id } = this.state
    console.log("clicked", id)
    if (id) this.props.history.push(`/messaging/thread/${id}`)
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
        this.setState({ following: true })
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
        this.setState({ following: false })
      },
    })
  }
}

export const FOLLOW_MUTATION = gql`
  mutation FollowMutation($id: ID!) {
    follow(id: $id) {
      id
    }
  }
`

export const UNFOLLOW_MUTATION = gql`
  mutation UnfollowMutation($id: ID!) {
    unfollow(id: $id) {
      id
    }
  }
`

export const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      follows {
        id
      }
    }
  }
`


export default withStyles(styles)(withRouter(Channel))