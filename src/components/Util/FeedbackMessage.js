import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'

// requires message, type ['success', 'error', 'alert', 'info']
const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
})

class FeedbackMessage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true,
      message: props.message,
      type: props.type,
    }
  }

  handleClick = () => {
    this.setState({ open: true })
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ open: false })
  };

  render() {
    const { classes } = this.props
    const { message, type } = this.state

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={`${message}`}
        />
    )
  }
}

FeedbackMessage.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(FeedbackMessage)