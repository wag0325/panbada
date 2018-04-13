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

import CreateExperience from './CreateExperience'

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

class CreateExperienceModal extends Component {
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

  render() {
  	const { classes, experience } = this.props
    
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{experience ? 'Edit Experience' : 'New Work Experience'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Create a new work experience.
          </DialogContentText>
          {experience 
            ? <CreateExperience id={this.props.id} handleClose={this.handleClose} experience={experience}/>
            : <CreateExperience id={this.props.id} handleClose={this.handleClose}/> }
        </DialogContent>
      </Dialog>
      
    )
  }
}

export default withStyles(styles)(withRouter(CreateExperienceModal))