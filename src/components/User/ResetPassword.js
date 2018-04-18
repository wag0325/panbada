import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import classNames from 'classnames'
import IconButton from 'material-ui/IconButton'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Visibility from 'material-ui-icons/Visibility'
import VisibilityOff from 'material-ui-icons/VisibilityOff'


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  actions: {
    marginTop: 20,
  }
})

class ResetPassword extends Component {
  render() {
    const { classes } = this.props

    return (
      <div>
        <h4 className="mv3">Reset Password</h4>
        <p>Send email at help@panbada.com to reset your password.</p>
        <Button color='default' className={this.props.button} onClick={() => this._backToLogin()}>
          Back to Login
        </Button>
        <Button color='default' className={this.props.button} onClick={() => this._backToHome()}>
          Back to Home
        </Button>
      </div>
    )
  }

  _backToHome = () => {
    this.props.history.push(`/`)
  }

  _backToLogin = () => {
    this.props.history.push(`/login`)
  }
}

export default withRouter(withStyles(styles)(ResetPassword))