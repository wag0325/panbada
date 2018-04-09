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
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import MoreHorizIcon from 'material-ui-icons/MoreHoriz'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import SendMessageModal from '../Message/SendMessageModal'

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
  constructor(props) {
    super(props)

    this.state = {
      secondary: false,
      userId: props.user.id,
      following: false,
      anchorEl: null,
      openModal: false,
    }
  }

  componentWillReceiveProps(nextProps){
    const { user } = nextProps
    const { me } = nextProps.meQuery 
  
    if (me && user) {      
      me.follows.map(follow => {
        if (follow.id === user.id) {
          this.setState({following: true})
          return false
        }
      })
    }
  }


  // componentWillMount() {
  //   this.setState({userId: this.props.user.id})
  // }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { secondary, following, anchorEl, openModal } = this.state
    const { user } = this.props

    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar aria-label={`${user.firstName}-${user.lastName}`}
              className={this.props.avatar} 
              src={user.avatarURL || AVATAR_DEFAULT}
          />
        </ListItemAvatar>
        <Link to={`/u/${user.id}`}><ListItemText
          primary={`${user.firstName} ${user.lastName}`}
          secondary={secondary ? 'Secondary text' : null}
        /></Link>
        <ListItemSecondaryAction>
          {following ? (<Button variant="raised" size="small" onClick={() => this._unfollowUser()}>Following</Button>) : (<Button variant="raised" size="small" onClick={() => this._followUser()}>Follow</Button>)}
          <IconButton
            aria-label="More"
            aria-owns={anchorEl ? 'long-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
            >
            <MenuItem onClick={this.handleClose, this._handleSendMessage}>Send Message</MenuItem>
          </Menu>
        </ListItemSecondaryAction>
        { openModal && (<SendMessageModal open={openModal} id={user.id} />)}
      </ListItem>
    )
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  
  _handleSendMessage = () => {
    console.log("send message")
    this.setState({ openModal: true })
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


export default withStyles(styles)(compose(
  graphql(FOLLOW_MUTATION, {name: 'followMutation',}),
  graphql(UNFOLLOW_MUTATION, {name: 'unfollowMutation',}),
  graphql(ME_QUERY, {name: 'meQuery'}),
)(User))