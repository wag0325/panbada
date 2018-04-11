import React, { Component } from 'react'

import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import { LinearProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { FormControl } from 'material-ui/Form'
import Avatar from 'material-ui/Avatar'
import Dropzone from 'react-dropzone'

import { AVATAR_DEFAULT } from '../../constants'
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
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
})

class UpdateMe extends Component {
  state = {
    firstName: '',
    lastName: '',
    avatarURL: '',
    errors: [],
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.meQuery.me) {
      const { me } = nextProps.meQuery
      this.setState({ 
        firstName: me.firstName, 
        lastName: me.lastName,
        avatarURL: me.avatarURL,
      })
    }
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
    
    return (
      <div>
        <form className={this.props.container} noValidate autoComplete="off">
          <FormControl className={classes.formControl}>
            <TextField
              id='firstName'
              label='First Name'
              className={this.props.textField}
              value={this.state.firstName || ''}
              onChange={e => this.setState({ firstName: e.target.value })}
              margin='normal'
            />
            <TextField
              id='lastName'
              label='Last Name'
              className={this.props.textField}
              value={this.state.lastName || ''}
              onChange={e => this.setState({ lastName: e.target.value })}
              margin='normal'
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Avatar
            alt={`${me.firstName}-${me.lastName}`}
            src={me.avatarURL || AVATAR_DEFAULT}
            className={classNames(classes.avatar, classes.bigAvatar)}
            />
            <TextField
              id='avatarURL'
              label='Avatar'
              className={this.props.textField}
              value={this.state.avatarURL || ''}
              onChange={e => this.setState({ avatarURL: e.target.value })}
              margin='normal'
            />
          </FormControl>
          <Button variant='raised' color='primary' className={this.props.button} onClick={() => this._confirm()}>
              Update
          </Button>
        </form>
        {$errorMessage}
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
      avatarURL,} = this.state
      
    this.props.updateMeMutation({
      variables: {
        firstName,
        lastName,
        avatarURL,
      }
    })
    .then(res => {
        if (!res.errors) {
          this.setState({errors: [{message: 'Successfully updated my profile.'}]})
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

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      firstName
      lastName
      avatarURL
    }
  }
`

const UPDATE_ME_MUTATION = gql`
  mutation UpdateMeMutation(
    $firstName: String, 
    $lastName: String, 
    $avatarURL: String,) {
    updateMe(
      firstName: $firstName,
      lastName: $lastName,
      avatarURL: $avatarURL,
      ) {
      id
      firstName
      lastName
      avatarURL
    }
  }
`

export default withStyles(styles)(compose(
  graphql(ME_QUERY, { name: 'meQuery'}),
  graphql(UPDATE_ME_MUTATION, { name: 'updateMeMutation'}),
)(UpdateMe))