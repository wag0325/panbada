import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import {withRouter} from 'react-router-dom'

import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import AddIcon from 'material-ui-icons/Add'
import Tooltip from 'material-ui/Tooltip' 

import CreateMessage from './CreateMessage'

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'relative',
  },
  button: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
})

class SendMessageModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: props.open,
      id: props.id,
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setState({ open: false })
  }

  handleSubmit = () => {
    console.log("submitted")
    this.props.history.push(`/messaging/thread/${this.state.id}`)
  }

  render() {
  	const { classes } = this.props

    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Send A Message'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Send a thoughtful message and connect. 
          </DialogContentText>
          <CreateMessage id={this.props.id} afterSubmit={this.handleSubmit}/>
        </DialogContent>
      </Dialog>
      
    )
  }
}

export default withStyles(styles)(withRouter(SendMessageModal))