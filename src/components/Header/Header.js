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

import SearchForm from '../Search/SearchForm'
import { AUTH_TOKEN } from '../../constants'

import UserSpecificMenu from './UserSpecificMenu'
import HeaderMenu from './HeaderMenu'

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
  logoWrapper: {
  },
  logo: {
    display: 'inline-block',
  },
  logoDescription: {
    fontSize: 10,
    display: 'inline-block',
  },
  menuItem: {
    padding: 10,
  }, 
  menuItemLink: {
    color: '#fff',
    fontSize: 13,
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

class Header extends Component {
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
      <div className={classes.root}>
        <AppBar position="static" color='default'>
          <Toolbar className={classes.headerInner}>
            <Link className={classes.logoWrapper} to="/">
            <Typography variant="title" color="inherit" className={classes.logo}>
              panbada
            </Typography>
            <Typography variant="subheading" color="inherit" className={classes.logoDescription}>
              beta
            </Typography>
            </Link>
            <SearchForm />
            <HeaderMenu />            
          </Toolbar>
        </AppBar>
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


export default withStyles(styles)(withRouter(Header))