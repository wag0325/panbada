import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import classNames from 'classnames';
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';
import Avatar from 'material-ui/Avatar';

import { AUTH_TOKEN } from '../../constants'

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
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
});

class User extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const user = this.props.userQuery.user
    const { classes } = this.props;

    if (this.props.userQuery && this.props.userQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
        )
    }

    
    if (this.props.userQuery && this.props.userQuery.error) {
      return <div>Error</div>
    }
    
    return (
      <div>
        <Avatar
          alt={`${user.firstName} ${user.lastName}`}
          src={user.avatar_url}
          className={classNames(classes.avatar, classes.bigAvatar)}
        />
        <div>{user.firstName} {user.lastName}</div>
        <div>{user.email}</div>
        <div>{user.avatar_url}</div>
        <Button size="small" onClick={() => this._saveGig()}>Connect</Button>
        <Button size="small" onClick={() => this._contactGig()}>Contact</Button>
      </div>
    )
  }
}

export const USER_QUERY = gql`
  query UserQuery($userId: ID!) {
    user(userId: $userId) {
      firstName
      lastName
      id
      email
      avatar_url
    }
  }
`

export default withStyles(styles)(graphql(USER_QUERY, { 
    name: 'userQuery',
    options: (props) => ({
      variables: { userId: props.match.params.id }
    }),
  })(User))