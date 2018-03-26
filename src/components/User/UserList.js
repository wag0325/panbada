import React, { Component } from 'react'
import User from './User'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import List from 'material-ui/List'

import { ME_ID, USERS_PER_PAGE, USERS_ORDER_BY } from '../../constants'


const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
})

class UserList extends Component {
  state = {
    dense: false,
  };

  render() {
    const { dense } = this.state
    const { classes } = this.props
    const meId = localStorage.getItem(ME_ID)

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
      <Paper className={classes.root} elevation={4}>
        <List dense={dense}>
          {usersToRender.map((user, index) => 
            <User key={user.node.id} index={index} user={user.node} />)}
        </List>
      </Paper>
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