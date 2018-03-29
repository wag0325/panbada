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
  displayName: {
    fontSize:13,
    color: theme.palette.text.secondary,
  },
  time: {
    fontSize:12,
    color: theme.palette.text.secondary,
  },
  message: {
    fontSize: 14,
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    marginBottom: 5,
    marginTop: 3,
    borderRadius: 4,
    border: '1px solid #d6d7da',
  },
})

const meId = localStorage.getItem(ME_ID)

class Channel extends Component {
  constructor(props) {
    super(props)
    // console.log("me", props.meQuery.me)
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
    const user = message.from

    return (      
      <div className={classes.messageRow}>
        <div className={classes.messageWrapper}>
          <div className={classes.avatarWrapper}>
            <Avatar aria-label={`${user.firstName}-${user.lastName}`}
                className={this.props.avatar} 
                src={user.avatarURL || AVATAR_DEFAULT}
            />
          </div>
          <div className={classes.content}>
            <div className={classes.displayName}>{`${user.firstName} ${user.lastName}`}</div>
            <div className={classes.message}>{`${message.text}`}</div>
            <div className={classes.time}>{displayTime(message.createdAt)}</div>
          </div>
        </div> 
      </div>
    )
  }
}


export default withStyles(styles)(Channel)