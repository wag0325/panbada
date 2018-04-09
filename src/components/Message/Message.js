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
import IconButton from 'material-ui/IconButton'

import { displayTime } from '../../utils'
import { AUTH_TOKEN, ME_ID, AVATAR_DEFAULT } from '../../constants'

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
  messageRow: {
  },
  messageWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
  },
  messageWrapperMe: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 10,
    marginBottom: 10,
    textAlign: 'right',
  },
  displayName: {
    fontSize:13,
    color: theme.palette.text.secondary,
  },
  time: {
    fontSize:12,
    color: theme.palette.text.secondary,
  },
  avatar: {
    float: 'left',
    width: 25,
    height: 25, 
    marginRight: 10,
  },
  content: {
    display: 'inline-block',
    maxWidth: '80%',
  },
  text: {
    fontSize: 14,
    paddingTop: 5,
    paddingLeft: 10,
    paddingBottom: 5,
    paddingRight: 10,
    marginBottom: 5,
    marginTop: 3,
    borderRadius: 4,
    border: '1px solid #d6d7da',
    display: 'inline-block',
    textAlign: 'left',
  },
})

const meId = localStorage.getItem(ME_ID)

class Channel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      me: meId === props.message.from.id ? true : false,
    }
  }

  // componentWillReceiveProps(nextProps){
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
  // }


  // componentWillMount() {
  //   this.setState({userId: this.props.user.id})
  // }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    
    // Only one recipient
    const { message, classes } = this.props
    const { me } = this.state
    const user = message.from

    return (      
      <div className={classes.messageRow}>
        <div className={me ? classes.messageWrapperMe : classes.messageWrapper}>
          {!me && (<Avatar aria-label={`${user.firstName}-${user.lastName}`}
              className={classes.avatar} 
              src={user.avatarURL || AVATAR_DEFAULT}
          />) }
          <div className={classes.content}>
            {!me && (<div className={classes.displayName}>{`${user.firstName} ${user.lastName}`}</div>) }
            <div className={classes.text}>{`${message.text}`}</div>
            <div className={classes.time}>{displayTime(message.createdAt)}</div>
          </div>
        </div> 
      </div>
    )
  }
}


export default withStyles(styles)(Channel)