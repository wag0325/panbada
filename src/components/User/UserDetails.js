import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Avatar from 'material-ui/Avatar'

import { AUTH_TOKEN } from '../../constants'

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
})

class User extends Component {
  constructor(props) {
    super(props)

    // console.log("me", props.meQuery.me)
    this.state = {
      following: false,
      myProfile: false,
    }
  }
  // state = {
  //   following: false,
  //   myProfile: false,
  // }

  componentWillReceiveProps(nextProps){
    const { user } = nextProps.userQuery
    const { me } = nextProps.meQuery 
  
    if (me && user) {
      console.log("props ", me, user)
      if (me.id === user.id) {
        this.setState({myProfile: true})
      }
      
      me.follows.map(follow => {
        if (follow.id === user.id) {
          this.setState({following: true})
          return false
        }
      })
    }
  }

  render() {
    const { classes } = this.props
    const user = this.props.userQuery.user
    const { myProfile, following } = this.state

    console.log("state ", myProfile, following)
    if ((this.props.userQuery && this.props.userQuery.loading) ||
        (this.props.meQuery && this.props.meQuery.loading)
        ) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
        )
    }

    
    if ((this.props.userQuery && this.props.userQuery.error) ||
        (this.props.meQuery && this.props.meQuery.error)
        ) {
      return <div>Error</div>
    }     
    
    return (
      <div>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            image="https://api.adorable.io/avatars/285/abott@adorable.png"
            title="Live from space album cover"
          />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="headline">{user.firstName} {user.lastName}</Typography>
              <Typography variant="subheading" color="textSecondary">
                Actor | Producer
              </Typography>
              <Typography variant="subheading" color="textSecondary">
                {user.followers.length} Followers {user.follows.length} Followers
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              {myProfile && <Button variant='raised' color='default' onClick={() => this._updateProfile()}>Update Profile</Button>}
              {!myProfile && following && <Button variant='raised' color='default' onClick={() => this._unfollowUser()}>Following</Button>}
              {!myProfile && !following && <Button variant='raised' color='primary' onClick={() => this._followUser()}>Follow</Button>}
            </div>
          </div>
        </Card> 
      </div>
    )
  }
}

export const USER_QUERY = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      firstName
      lastName
      id
      email
      avatarURL
      followers {
        id
      }
      follows {
        id
      }
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
  graphql(USER_QUERY, { 
    name: 'userQuery',
    options: (props) => ({
      variables: { id: props.userId }
    }),
  }),
  graphql(ME_QUERY, {name: 'meQuery'}),
  )(User))