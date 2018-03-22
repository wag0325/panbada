import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dropzone from "react-dropzone";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
});

class UpdateMe extends Component {
  state = {
    firstName: '',
    lastName: '',
    avatar_url: '',
    oldPassword: '',
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
    if (this.props.meQuery && this.props.meQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
      )
    }
    
    if (this.props.meQuery && this.props.meQuery.error) {
      return <div>Error</div>
    }

    const me = this.props.meQuery.me
    console.log("me ", me)
    
    return (
      <div>
        <div>{me.id}</div>
        {this.state.firstName}
        {this.state.lastName}
        {this.state.avatar_url}
        <form className={this.props.container} noValidate autoComplete="off">
        <div>{this.props.meQuery.me.firstName}</div>
        <TextField
          id="firstName"
          label="First Name"
          className={this.props.textField}
          value={this.state.firstName || ''}
          onChange={e => this.setState({ firstName: e.target.value })}
          margin="normal"
        />
        <TextField
          id="lastName"
          label="Last Name"
          className={this.props.textField}
          value={this.state.lastName || ''}
          onChange={e => this.setState({ lastName: e.target.value })}
          margin="normal"
        />
        <TextField
          id="avatar_url"
          label="Avatar"
          className={this.props.textField}
          value={this.state.avatar_url || ''}
          onChange={e => this.setState({ avatar_url: e.target.value })}
          margin="normal"
        />
        <TextField
          id="curr_password"
          label="Current Password"
          className={this.props.textField}
          value={this.state.oldPassword}
          onChange={e => this.setState({ oldPassword: e.target.value })}
          margin="normal"
        />
        <TextField
          id="new_password"
          label="New Password"
          className={this.props.textField}
          value={this.state.newPassword}
          onChange={e => this.setState({ newPassword: e.target.value })}
          margin="normal"
        />
        <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._confirm()}>
            Update
        </Button>
      </form>
      </div>
    )
  }
  
  _likePost = async () => {
    const postId = this.props.post.id
    await this.props.postLikeMutation({
      variables: {
        postId
      },
      update: (store, {data: {postLike}}) => {
        this.props.updateStoreAfterPostLike(store, postLike, postId)
      },
    })
  }

  _confirm = () => {
    const { 
      firstName, 
      lastName, 
      avatar_url, 
      oldPassword, 
      newPassword } = this.state
      
    this.props.updateMeMutation({
      variables: {
        firstName,
        lastName,
        avatar_url,
        oldPassword,
        newPassword,
      }
    })
  }
}

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      firstName
      lastName
      avatar_url
    }
  }
`

const UPDATE_ME_MUTATION = gql`
  mutation UpdateMeMutation(
    $firstName: String, 
    $lastName: String, 
    $avatar_url: String,
    $oldPassword: String,
    $newPassword: String) {
    updateMe(
      firstName: $firstName,
      lastName: $lastName,
      avatar_url: $avatar_url,
      oldPassword: $oldPassword,
      newPassword: $newPassword
      ) {
      id
      firstName
      lastName
      avatar_url
    }
  }
`

export default withStyles(styles)(compose(
  graphql(ME_QUERY, { name: 'meQuery'}),
  graphql(UPDATE_ME_MUTATION, { name: 'updateMeMutation'}),
)(UpdateMe))