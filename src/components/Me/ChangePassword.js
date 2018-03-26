import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { FormControl, FormHelperText } from 'material-ui/Form'


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  formControl: {
    display: 'block'
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  root: {
    flexGrow: 1,
  },

})

class UpdateMe extends Component {
  state = {
    currPassword: '',
    newPassword: '',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.meQuery.me) {
      const { me } = nextProps.meQuery
      this.setState({ 
        firstName: me.firstName, 
        lastName: me.lastName,
        avatar_url: me.avatar_url,
      })
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <form className={this.props.container} noValidate autoComplete='off'>
          <FormControl className={classes.formControl}>
            <TextField
              id='curr_password'
              label='Current Password'
              className={this.props.textField}
              value={this.state.currPassword}
              onChange={e => this.setState({ currPassword: e.target.value })}
              margin='normal'
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextField
              id='new_password'
              label='New Password'
              className={this.props.textField}
              value={this.state.newPassword}
              onChange={e => this.setState({ newPassword: e.target.value })}
              margin='normal'
            />
          </FormControl>
          <Button variant='raised' color='primary' className={this.props.button} onClick={() => this._confirm()}>
              Update
          </Button>
        </form>
      </div>
    )
  }
  

  _confirm = () => {
    const { 
      currPassword, 
      newPassword } = this.state
      
    this.props.updateMeMutation({
      variables: {
        currPassword,
        newPassword,
      }
    })
  }
}

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation(
    $currPassword: String,
    $newPassword: String) {
    updatePassword(
      currPassword: $currPassword,
      newPassword: $newPassword
      ) {
      id
    }
  }
`

export default withStyles(styles)(
  graphql(UPDATE_PASSWORD_MUTATION, {name: 'updatePasswordMutation'})(UpdateMe)
)