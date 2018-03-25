import React, { Component } from 'react'
import User from './User'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';
import List from 'material-ui/List'

import { USERS_PER_PAGE, USERS_ORDER_BY } from '../../constants'


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

    const usersToRender = this.props.userFeedQuery.usersConnection.edges
    
    return (
      <List dense={dense}>
        {usersToRender.map((user, index) => 
          <User key={user.node.id} index={index} user={user.node} />)}
      </List>
    )
  }
}

export const USER_FEED_QUERY = gql`
  query UsersConnectionQuery($first: Int, $after: String, $orderBy: UserOrderByInput) {
    usersConnection(first: $first, after: $after, orderBy: $orderBy,) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          email
          firstName
          lastName
          avatarURL
        }
      }
      aggregate {
        count
      }
    }
  }
`

export default withStyles(styles)(graphql(USER_FEED_QUERY, {
 name: 'userFeedQuery',
 options: ownProps => {
    let after = ownProps.endCursor || null
    return {
      variables: { first: USERS_PER_PAGE, after:after, orderBy: USERS_ORDER_BY }
    }
  },
})(UserList))