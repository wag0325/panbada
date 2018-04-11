import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import { Manager, Target, Popper } from 'react-popper'
import { MenuItem, MenuList } from 'material-ui/Menu'
import Paper from 'material-ui/Paper'
import Grow from 'material-ui/transitions/Grow'
import ClickAwayListener from 'material-ui/utils/ClickAwayListener'
import Tooltip from 'material-ui/Tooltip'

import IconButton from 'material-ui/IconButton'
import AccountCircle from 'material-ui-icons/AccountCircle'
import Chat from 'material-ui-icons/Chat'

import { AUTH_TOKEN } from '../../constants'

// Notifications
// ME Query => GET Notifications, 
const styles = theme => ({
  loggedInMenu: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  popper: {
    zIndex:1
  },
  popperClose: {
    pointerEvents: 'none',
  },
})

class UserSpecificMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      meId: null, 
      lastMessageId: null,
    }
  }
  
  componentWillReceiveProps(nextProps) {
    let userId = null 
    
    if (!nextProps.meQuery.me ) return 
    
    const { me } = nextProps.meQuery    
    this.setState({meId: me.id})    
    
    if (!me.channels.length > 0) return 

    me.channels[me.channels.length-1].users.map(function(user){
      if (user.id != me.id) { 
        userId = user.id
      }
    })

    this.setState({lastMessageId: userId}) 
    
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { classes } = this.props
    const { open, lastMessageId, meId } = this.state
    const { me } = this.props.meQuery

    return (
      <div className={classes.loggedInMenu}>
        {lastMessageId && (<Link to={`/messaging/thread/${lastMessageId}`}>
          <Tooltip id='tooltip-icon' title='Messaging'>
            <IconButton aria-label='Messaging'>
              <Chat />
            </IconButton>
          </Tooltip>
        </Link>) }
        <Manager>
          <Target>
            <IconButton
              aria-owns={open ? 'menu-list' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={open}
            className={classNames(classes.popper, { [classes.popperClose]: !open })}
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow in={open} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                <Paper>
                  <MenuList role="menu">
                    <Link to={`/u/${meId}`}><MenuItem onClick={this.handleClose}>My Profile</MenuItem></Link>
                    <Link to="/myactivity"><MenuItem onClick={this.handleClose}>My Activity</MenuItem></Link>
                    <Link to="/mysettings"><MenuItem onClick={this.handleClose}>Settings</MenuItem></Link>
                    <MenuItem onClick={() => {
                      this.handleClose
                      localStorage.removeItem(AUTH_TOKEN)
                      this.props.history.push(`/`)
                    }}>Logout</MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          </Popper>
        </Manager>
      </div>
    )
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  };

  handleClose = () => {
    if (!this.state.open) {
      return
    }

    // setTimeout to ensure a close event comes after a target click event
    this.timeout = setTimeout(() => {
      this.setState({ open: false })
    })
  };
}

export const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      channels {
        id
        updatedAt
        users {
          id
        }
      }
    }
  }
`

export default withRouter(withStyles(styles)(graphql(ME_QUERY, { name: 'meQuery' })(UserSpecificMenu)))