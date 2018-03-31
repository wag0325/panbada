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
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import Home from 'material-ui-icons/Home'
import Explore from 'material-ui-icons/Explore'
import AccountCircle from 'material-ui-icons/AccountCircle'
import LocalActivity from 'material-ui-icons/LocalActivity'

import SearchForm from '../Search/SearchForm'
import { AUTH_TOKEN } from '../../constants'

import UserSpecificMenu from './UserSpecificMenu'


const styles = theme => ({
  headerInner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerMenu: {
    display: 'flex',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  menuItem: {
    padding: 10,
  }, 
  menuItemLink: {
    textDecorationLine: 'none',
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

class HeaderMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { classes } = this.props
    const { open } = this.state

    return (
      <div className={classes.headerMenu}>
        <div className={classes.menuItem}><Link className={classes.menuItemLink} to="/">
	        <Tooltip id="tooltip-icon" title="Home">
		        <IconButton aria-label="Home">
		          <Home />
		        </IconButton>
	      	</Tooltip>
      	</Link></div>
        <div className={classes.menuItem}><Link className={classes.menuItemLink} to="/people">
        	<Tooltip id="tooltip-icon" title="Explore">
		        <IconButton aria-label="Explore">
		          <Explore />
		        </IconButton>
	      	</Tooltip>
        </Link></div>
        <div className={classes.menuItem}><Link className={classes.menuItemLink} to="/gigs">
					<Tooltip id="tooltip-icon" title="Gig">
		        <IconButton aria-label="Gig">
		          <LocalActivity />
		        </IconButton>
	      	</Tooltip>
        </Link></div>
        {authToken ? (<UserSpecificMenu />) :
        (<div className={classes.menuItem}><Link className={classes.menuItemLink} to="/login" className="no-underline">SIGN IN</Link></div>)}
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


export default withStyles(styles)(withRouter(HeaderMenu))