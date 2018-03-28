import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN, ME_ID } from '../constants'

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

import SearchForm from './Search/SearchForm'

const styles = theme => ({
  root: {
    flexGrow: 1,
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

class HeaderM extends Component {
  state = {
    open: false,
  };
  
  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const meId = localStorage.getItem(ME_ID)
    console.log("meId", meId)
    const { classes } = this.props
    const { open } = this.state

    return (
      <div className={this.props.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={this.props.flex}>
              panbada
            </Typography>
            <SearchForm />
            <Link to="/"><Button color="inherit">Home</Button></Link>
            <Link to="/people"><Button color="inherit">People</Button></Link>
            <Link to="/gigs"><Button color="inherit">Gigs</Button></Link>
            {authToken && (<Link to="/create-post"><Button color="inherit">Submit</Button></Link>)}
            {authToken ? (
              <Manager>
                <Target>
                  <Button
                    aria-owns={open ? 'menu-list' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                  >
                    Me
                  </Button>
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
                          <Link to={`/u/${meId}`}><MenuItem onClick={this.handleClose}>Profile</MenuItem></Link>
                          <Link to="/mysettings"><MenuItem onClick={this.handleClose}>My account</MenuItem></Link>
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
              ) : (
              <Link to="/login" className="no-underline"><Button color="inherit">Login</Button></Link>
            )}
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

export default withStyles(styles)(withRouter(HeaderM))