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

import { AUTH_TOKEN, ME_ID } from '../constants'

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

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    showPassword: false,
  }

  render() {
    const { classes } = this.props
    
    return (
      <div>
        <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <form className={this.props.container} noValidate autoComplete="off">
          {!this.state.login && (
            <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="firstName"
              label="First Name"
              className={this.props.textField}
              value={this.state.firstName}
              onChange={e => this.setState({ firstName: e.target.value })}
              margin="normal"
            />
            </FormControl>
            )}
          {!this.state.login && (
            <FormControl fullWidth className={classes.formControl}>
            <TextField
              id="lastName"
              label="Last Name"
              className={this.props.textField}
              value={this.state.lastName}
              onChange={e => this.setState({ lastName: e.target.value })}
              margin="normal"
            />
            </FormControl>
            )}
          <FormControl fullWidth className={classes.formControl}>
          <TextField
            id="email"
            label="Email"
            className={this.props.textField}
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            margin="normal"
          />
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.handleChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <div className={classes.actions}>
            <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._confirm()}>
              {this.state.login ? 'login' : 'create account'}
            </Button>
            <Button className={this.props.button} onClick={() => this.setState({ login: !this.state.login })}>
              {this.state.login
                ? 'need to create an account?'
                : 'already have an account?'}
            </Button>
          </div>
        </form>
      </div>
    )
  }
  
  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  _confirm = async () => {
    const { firstName, lastName, email, password} = this.state
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      })
      const { token, user } = result.data.login
      this._saveUserData(token, user)
    } else {
      const result = await this.props.signupMutation({
        variables: {
          firstName,
          lastName,
          email,
          password,
        },
      })
      const { token, user } = result.data.signup
      this._saveUserData(token, user)
    }
    
    this.props.history.push(`/`)
  }

  _saveUserData = (token, user) => {
    localStorage.setItem(AUTH_TOKEN, token)
    localStorage.setItem(ME_ID, user.id)
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      token
      user {
        id
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
      }
    }
  }
`

export default withRouter(withStyles(styles)(compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' }),
)(Login)))