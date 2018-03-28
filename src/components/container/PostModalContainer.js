import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'

import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import AddIcon from 'material-ui-icons/Add'
import Tooltip from 'material-ui/Tooltip' 

import CreatePost from '../Post/CreatePost'

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

class PostModalContainer extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true })
  };

  handleClose = () => {
    this.setState({ open: false })
  };

  render() {
  	const { classes } = this.props

    return (
      <div>
      	<Tooltip id='tooltip-fab' className={classes.fab} title='Create A Post'>
					<Button variant='fab' color='primary' aria-label='add' className={classes.button} onClick={this.handleClickOpen}>
		        <AddIcon />
		      </Button>
	      </Tooltip>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>{'Creat A New Post'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Share your thoughts or cool photos with everyone.
            </DialogContentText>
            <CreatePost onClose={this.handleClose}/>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(PostModalContainer)