import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import SearchForm from '../Search/SearchForm'
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
    color: '#212121'
  },
  logoDescription: {
    fontSize: 10,
    display: 'inline-block',
    color: theme.palette.primary.main
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
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Toolbar className={classes.headerInner}>
            <Link className={classes.logoWrapper} to='/'>
            <Typography variant='title' className={classes.logo}>
              panbada
            </Typography>
            <Typography variant='subheading' className={classes.logoDescription}>
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
}


export default withStyles(styles)(withRouter(Header))