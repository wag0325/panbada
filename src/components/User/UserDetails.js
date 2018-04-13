import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {withRouter} from 'react-router-dom'

import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import MoreHorizIcon from 'material-ui-icons/MoreHoriz'
import Add from 'material-ui-icons/Add'
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from 'material-ui/List';

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import { FOLLOW_MUTATION, UNFOLLOW_MUTATION, ME_QUERY} from './User'
import { UserFragments } from '../../constants/gqlFragments'

import SendMessageModal from '../Message/SendMessageModal'
import CreateExperienceModal from '../User/CreateExperienceModal'
import Experience from './Experience'

const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
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
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
  section: {
    padding: 20,
  },
  sectionList: {
    listStyle: 'none',
    padding: 0,
  },
})

class UserDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      following: false,
      myProfile: false,
      anchorEl: null,
      openModal: false,
      openExperienceModal: false,
    }
  }
  
  componentWillUpdate() {
    if (this.state.openModal || this.state.openExperienceModal) {
      this.setState({
        anchorEl: null,
        openModal: false,
        openExperienceModal: false,
      })
    }
  }

  componentWillReceiveProps(nextProps){
    const { user } = nextProps.userQuery
    const { me } = nextProps.meQuery 
  
    if (me && user) {
      if (me.id === user.id) {
        this.setState({myProfile: true})
      }
      
      if( me.follows.length === 0 ) return

      me.follows.map(follow => {
        if (follow.id === user.id) {
          this.setState({following: true})
          return false
        }
      })
    }
  }

  render() {
    if ((this.props.userQuery && this.props.userQuery.loading) ||
        (this.props.meQuery && this.props.meQuery.loading)
        ) {
      return <CircularProgress className={this.props.progress} size={30} />
      // return (
      //   <div className={this.props.root}>
      //     <LinearProgress />
      //   </div>
      //   )
    }

    
    if ((this.props.userQuery && this.props.userQuery.error) ||
        (this.props.meQuery && this.props.meQuery.error)
        ) {
      return <div>Error</div>
    }     

    const { classes } = this.props
    console.log("user details ", this.props)
    const user = this.props.userQuery.user
    const { myProfile, following, openModal, openExperienceModal, anchorEl } = this.state

    
    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            image={user.avatarURL || AVATAR_DEFAULT}
            title="Live from space album cover"
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="headline">{user.firstName} {user.lastName}</Typography>
              <Typography variant="subheading" color="textSecondary">
                Actor | Producer
              </Typography>
              <Typography variant="subheading" color="textSecondary">
                {user.followers.length} Followers {user.follows.length} Following
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              {myProfile && <Button variant='raised' color='default' onClick={() => this._editProfile()}>Edit Profile</Button>}
              {!myProfile && following && <Button variant='raised' color='default' onClick={() => this._unfollowUser()}>Following</Button>}
              {!myProfile && !following && <Button variant='raised' color='primary' onClick={() => this._followUser()}>Follow</Button>}
              {!myProfile && (
                <div>
                  <IconButton
                    aria-label='More'
                    aria-owns={anchorEl ? 'long-menu' : null}
                    aria-haspopup='true'
                    onClick={this.handleClick}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id='simple-menu'
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                    >
                    <MenuItem onClick={this.handleClose, this._handleSendMessage}>Send Message</MenuItem>
                  </Menu>
                </div>
                )}
            </div>
          </div>
        </Card> 
        <Paper className={classes.experience} elevation={4}>
          <div className={classes.section}>
            <div className={classes.subheader}>
              <Typography variant='subheading'>Experiences</Typography>
              <div className={classes.sectionAction}>
                <IconButton 
                  onClick={()=>this._handleCreateExperience()} 
                  aria-label='Create Experience'>
                  <Add/>
                </IconButton>
              </div>
            </div>
            <ul className={classes.sectionList}>
              {user.experiences.length > 0 ? (user.experiences.map(experience => {
                return (
                  <Experience key={experience.id} experience={experience} myProfile={myProfile} userId={user.id}/>
                )
              })) : <li>There is no listed experience.</li>}
            </ul>
          </div>
        </Paper>
        { openModal && (<SendMessageModal open={openModal} id={user.id} />)}
        { openExperienceModal && (<CreateExperienceModal open={openExperienceModal} id={user.id} />)}
      </div>
    )
  }
  
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null })
  };
  
  _editProfile = () => {
    this.props.history.push(`/mysettings`)
  }
  
  _handleCreateExperience = () => {
    this.setState({ openExperienceModal: true })
  }

  _handleSendMessage = () => {
    this.setState({ openModal: true })
  }

  _followUser = async () => {
    const { id } = this.props.userQuery.user
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
    const { id } = this.props.userQuery.user
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

export const USER_QUERY = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      ...BasicUserInfo
      followers {
        id
      }
      follows {
        id
      }
      experiences {
        ...Experience
      }
    }
  }
  ${UserFragments.basicInfo}
  ${UserFragments.experience}
`

export default withStyles(styles)(compose(
  graphql(USER_QUERY, { 
    name: 'userQuery',
    options: (props) => ({
      variables: { id: props.userId }
    }),
  }),
  graphql(FOLLOW_MUTATION, {name: 'followMutation',}),
  graphql(UNFOLLOW_MUTATION, {name: 'unfollowMutation',}),
  graphql(ME_QUERY, {name: 'meQuery'}),
  )(withRouter(UserDetails)))