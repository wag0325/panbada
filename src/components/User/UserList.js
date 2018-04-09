import React, { Component } from 'react'
import User from './User'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import List from 'material-ui/List'
import Button from 'material-ui/Button'

import { ME_ID, USERS_PER_PAGE, USERS_ORDER_BY } from '../../constants'
import { UserFragments } from '../../constants/gqlFragments'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  loadMoreWrapper: {
    margin: 5,
    marginTop: 20,
    textAlign: 'center',
  },
})

class UserList extends Component {
  state = {
    dense: false,
    hasNextPage: true,
  }

  componentWillReceiveProps(nextProps) {
    const { hasNextPage } = nextProps.userFeedQuery.usersConnection.pageInfo
    this.setState({hasNextPage: hasNextPage })
  }

  render() {
    const { dense, hasNextPage } = this.state
    const { classes } = this.props
    const meId = localStorage.getItem(ME_ID)
    let $loadMoreButton = null 

    if (this.props.userFeedQuery && this.props.userFeedQuery.loading) {
      return <CircularProgress className={this.props.progress} size={50} />
      // return (
      //   <div className={this.props.root}>
      //     <LinearProgress />
      //   </div>
      //   )
    }
    
    if (this.props.userFeedQuery && this.props.userFeedQuery.error) {
      return <div>Error</div>
    }
    
    if(hasNextPage) {
      $loadMoreButton = 
        (<div className={classes.loadMoreWrapper}>
          <Button variant='raised' className={classes.button} onClick={this._loadMoreRows}>
            Load More
          </Button></div>)
    }

    const usersToRender = this.props.userFeedQuery.usersConnection.edges
    
    return (
      <div>
      <Paper className={classes.root} elevation={4}>
        <List dense={dense}>
          {usersToRender.map((user, index) => {
            if (user.node.id !== meId) {
              return (<User key={user.node.id} index={index} user={user.node} />)
            }
            return null
            })}
          {usersToRender.length === 0 && (<div>Sorry, no such user exists. Please try again.</div>)}
        </List>
      </Paper>
      {$loadMoreButton}
      </div>
    )
  }

  _loadMoreRows = () => {
    const { usersConnection, fetchMore } = this.props.userFeedQuery
    fetchMore({
      variables: { after: usersConnection.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {

        if (!fetchMoreResult) {
          return false
        }

        const prevPostFeed = previousResult.usersConnection.edges
        const newPostFeed =
          fetchMoreResult.usersConnection.edges

        const newPostsData = {...fetchMoreResult.usersConnection, 
          edges: [
            ...prevPostFeed,
            ...newPostFeed,
          ]}

        const newData = {
          ...previousResult,
          usersConnection: newPostsData
        }
        
        return newData
      },
    })
  }
}

export const USER_FEED_QUERY = gql`
  query UsersConnectionQuery($first: Int, $after: String, $orderBy: UserOrderByInput, $filter: String,) {
    usersConnection(first: $first, after: $after, orderBy: $orderBy, filter: $filter,) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...BasicUserInfo
        }
      }
      aggregate {
        count
      }
    }
  }
  ${UserFragments.basicInfo}
`

export default withStyles(styles)(graphql(USER_FEED_QUERY, {
 name: 'userFeedQuery',
 options: ownProps => {
    let after = ownProps.endCursor || null
    let filter = decodeURIComponent(ownProps.filter) || null
    if (!filter || filter === 'undefined') filter = null
    
    return {
      variables: { first: USERS_PER_PAGE, after:after, orderBy: USERS_ORDER_BY, filter: filter }
    }
  },
})(UserList))