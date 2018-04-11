import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { FormControl } from 'material-ui/Form'

import FeedbackMessage from '../Util/FeedbackMessage'

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


class ChangePassword extends Component {
  state = {
    currPassword: '',
    newPassword: '',
    errors: [],
  }
  
  componentWillUpdate() {
    if (this.state.errors.length > 0 ) this.setState({errors: []})
  }

  render() {
    const { classes } = this.props
    
    const { errors } = this.state
    let $errorMessage = null
    if (errors.length > 0) {
      $errorMessage = (<FeedbackMessage type='error' message={errors[0].message} />)
    }

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
          <Button variant='raised' color='primary' className={this.props.button} onClick={() => this._changePassword()}>
              Update
          </Button>
        </form>
        {$errorMessage}
      </div>
    )
  }
  

  _changePassword = () => {
    const { 
      currPassword, 
      newPassword } = this.state

    this.props.changePasswordMutation({
      variables: {
        currPassword,
        newPassword,
      }
    })
    .then(res => {
        if (!res.errors) {
          this.setState({errors: [{message: 'Successfully updated the password.'}]})
        } else {
            // handle errors with status code 200
            console.log('200 errors ', res.errors)
            if (res.errors.length > 0) this.setState({errors: res.errors})
        }
      })
      .catch(e => {
        // GraphQL errors can be extracted here
        if (e.graphQLErrors) {
            console.log('catch errors ', e.graphQLErrors)
            this.setState({errors: e.graphQLErrors})
        }
       }) 
  }
}

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePasswordMutation(
    $currPassword: String!,
    $newPassword: String!) {
    changePassword(
      currPassword: $currPassword,
      newPassword: $newPassword
      ) {
      id
    }
  }
`

export default withStyles(styles)(graphql(CHANGE_PASSWORD_MUTATION, { 
  name: 'changePasswordMutation',
})(ChangePassword))