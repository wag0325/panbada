import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField'
import Dropzone from "react-dropzone";

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
});

class UpdateMe extends Component {
    state = {
      firstName: "Jane",
      lastName: '',
      oldPassword: '',
      newPassword: '',
      avatar_url: '',
    }

  // constructor(props) {
  //   super(props)
    
  //   console.log("props ", props)
  //   console.log("props ", props.meQuery)
  //   // this.state = {
  //   //   firstName: props.meQuery.me.firstName,
  //   //   lastName: props.meQuery.me.lastName,
  //   //   avatar_url: props.meQuery.me.avatar_url,
  //   // }
  // }
  
  // componentWillMount(props) {
  //   this.setState({
  //     firstName: props.meQuery.me.firstName,
  //     lastName: props.meQuery.me.lastName,
  //     avatar_url: props.meQuery.me.avatar_url,
  //   })
  //   console.log("props ", this.props.meQuery)
  // }
  // componentDidMount() {
  //   // console.log("firstName", this.props.meQuery.me.firstName)
  //   // this.setState({ 
  //   //   firstName: this.props.meQuery.me.firstName,
  //   //  })
  // }

  render() {
    console.log("props inside", this.props)
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

    return (      
      <form className={this.props.container} noValidate autoComplete="off">
        <div>{this.props.meQuery.me.firstName}</div>
        <input
          id="firstName"
          label="First Name"
          className={this.props.textField}
          value={this.state.firstName}
          onChange={e => this.setState({ firstName: e.target.value })}
          margin="normal"
          defaultValue="Jane"
        />
        <TextField
          id="lastName"
          label="Last Name"
          className={this.props.textField}
          value={this.state.lastName}
          onChange={e => this.setState({ lastName: e.target.value })}
          margin="normal"
          defaultValue={this.props.meQuery.lastName}
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
            Submit
        </Button>
      </form>
    )
  }

  _confirm = async () => {
    const { firstName, lastName, avatar_url, oldPassword, newPassword} = this.state
    await this.props.updateMeMutation({
      variables: {
        firstName,
        lastName,
        avatar_url
      },
    })
  }
}

const UPDATE_ME_MUTATION = gql`
  mutation UpdateMeMutation($newPassword: String!, $oldPassword: String, $firstName: String, $lastName: String, $avatar_url: String) {
    updateMe(newPassword: $newPassword, oldPassword: $oldPassword, firstName: $firstName, lastName: $lastName, avatar_url: $avatar_url) {
      firstName
      lastName
      avatar_url
    }
  }
`

const ME_QUERY = gql`
  query MeQuery {
    me {
      firstName
      lastName
      avatarURL
    }
  }
`

export default compose(
  graphql(ME_QUERY, { name: 'meQuery' }),
)(UpdateMe)