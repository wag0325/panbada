import React, { Component } from 'react'
import User from './User'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';

import List from 'material-ui/List';
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
});

class UserList extends Component {
  state = {
    dense: false,
  };

  render() {
    const { dense } = this.state;

    if (this.props.userFeedQuery && this.props.userFeedQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
        )
    }
    
    if (this.props.userFeedQuery && this.props.userFeedQuery.error) {
      return <div>Error</div>
    }

    const usersToRender = this.props.userFeedQuery.userFeed
    
    return (
      <List dense={dense}>
        {usersToRender.map((user, index) => 
          <User key={user.id} index={index} user={user} />)}
      </List>
    )
  }
}

export const USER_FEED_QUERY = gql`
  query UserFeedQuery {
    userFeed {
      id
      firstName
      lastName
      email
      avatar_url
    }
  }
`
export default withStyles(styles)(graphql(USER_FEED_QUERY, { name: 'userFeedQuery'})(UserList))