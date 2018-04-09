import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'

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

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import { GigFragments, UserFragments } from '../../constants/gqlFragments'

import SendMessageModal from '../Message/SendMessageModal'
import MapContainer from '../Geo/MapContainer'

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
  description: {
    padding: 15,
    marginTop: 10,
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

class GigDetails extends Component {
  constructor(props) {
    super(props)

    // console.log("me", props.meQuery.me)
    this.state = {
      following: false,
      myGig: false,
      anchorEl: null,
      openModal: false,
    }
  }

  componentWillReceiveProps(nextProps){
    // const { user } = nextProps.userQuery
    // const { me } = nextProps.meQuery 
  
    // if (me && user) {
    //   console.log("props ", me, user)
    //   if (me.id === user.id) {
    //     this.setState({myProfile: true})
    //   }
      
    //   me.follows.map(follow => {
    //     if (follow.id === user.id) {
    //       this.setState({following: true})
    //       return false
    //     }
    //   })
    // }
  }

  render() {
    if (this.props.gigQuery && this.props.gigQuery.loading) {
      return <CircularProgress className={this.props.progress} size={30} />
      // return (
      //   <div className={this.props.root}>
      //     <LinearProgress />
      //   </div>
      //   )
    }

    
    if (this.props.gigQuery && this.props.gigQuery.error) {
      return <div>Error</div>
    }     
    
    const { classes } = this.props
    const { gig } = this.props.gigQuery
    const { location, startDateTime, endDateTime } = gig
    const user = gig.postedBy
    const { myGig, following, openModal, anchorEl } = this.state
    const pos = {lat: location.lat, lng: location.lng }
    let $dateTimeDisplay = null
    
    if (startDateTime || endDateTime) {
      $dateTimeDisplay = (
        <div>
          Start: {moment(startDateTime).format('LLL')} to {moment(null).format('LLL')}
        </div>
        )  
    }

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
              <Typography variant="headline">{gig.title}</Typography>
              <Typography variant="subheading" color="textSecondary">
                {gig.type} | {location.name} | {user.firstName} {user.lastName}
              </Typography>
            </CardContent>
            <CardActions>
              {!myGig ? (
                  <Button color='primary' variant='raised' onClick={this._handleSendMessage}>Contact</Button>
                ) : (
                  <Button color='default' variant='raised' onClick={this._handleEditGig}>Edit Gig</Button>
                )}
            </CardActions>
          </div>
        </Card> 
        { openModal && (<SendMessageModal open={openModal} id={user.id} />)}
        <Paper className={classes.description} elevation={4}>
          <Typography variant='headline' component='h3'>
          Description:
          </Typography>
          <Typography component='p'>
            {gig.text}
          </Typography>
        </Paper>
        <Paper className={classes.location} elevation={4}>
          {$dateTimeDisplay}
          <Typography component='p' className={classes.locationName}>
            Location: {location.name}          
          </Typography>
          <Typography component='p' className={classes.address}>
            Address: {location.address}
          </Typography>
          <Typography component='p' className={classes.directions}>
            Directions: {location.directions}
          </Typography>
          <MapContainer pos={pos}/>
        </Paper>
      </div>
    )
  }
  
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null })
  };
  
  _handleSendMessage = () => {
    this.setState({ openModal: true })
  }
  
  _handleEditGig = () => {

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

export const GIG_QUERY = gql`
  query GigQuery($id: String!) {
    gig(id: $id) {
      ...GigBasic
      postedBy {
        ...Avatar
      }
      location {
        ...Location
      }
    }
  }
  ${GigFragments.gigBasic}
  ${GigFragments.location}
  ${UserFragments.avatar}
`

export default withStyles(styles)(compose(
  graphql(GIG_QUERY, { 
    name: 'gigQuery',
    options: (props) => ({
      variables: { id: props.gigId }
    }),
  }),
  )(GigDetails))