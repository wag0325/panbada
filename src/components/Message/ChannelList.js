import React, { Component } from 'react'
import Channel from './Channel'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import List from 'material-ui/List'
import Button from 'material-ui/Button'

import { ME_ID, CHANNELS_PER_PAGE, CHANNELS_ORDER_BY } from '../../constants'


const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  root: {
    padding: 5,
    margin: 0,
  },
  loadMoreWrapper: {
    margin: 5,
    marginTop: 20,
    textAlign: 'center',
  },
})

class ChannelList extends Component {
  state = {
    dense: false,
    hasNextPage: true,
  };
  
  componentWillReceiveProps(nextProps) {
    const { hasNextPage } = nextProps.channelFeedQuery.channelsConnection.pageInfo
    this.setState({hasNextPage: hasNextPage })
  }

  render() {
    const { dense, hasNextPage } = this.state
    const { classes } = this.props
    const meId = localStorage.getItem(ME_ID)
    let $loadMoreButton = null 

    if (this.props.channelFeedQuery && this.props.channelFeedQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
        )
    }
    
    if (this.props.channelFeedQuery && this.props.channelFeedQuery.error) {
      return <div>Error</div>
    }
    
    if(hasNextPage) {
      $loadMoreButton = 
        (<div className={classes.loadMoreWrapper}>
          <Button variant='raised' className={classes.button} onClick={this._loadMoreRows}>
            Load More
          </Button></div>)
    }

    const channelsToRender = this.props.channelFeedQuery.channelsConnection.edges
    
    return (
      <Paper className={classes.root} elevation={4}>
        <List dense={dense}>
          {channelsToRender.map((channel, index) => 
            <Channel key={channel.node.id} index={index} channel={channel.node} currChannel={this.props.currChannel}/>)}
        </List>
        {$loadMoreButton}
      </Paper>
    )
  }

  _loadMoreRows = () => {
    const { channelsConnection, fetchMore } = this.props.channelFeedQuery
    fetchMore({
      variables: { after: channelsConnection.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {

        if (!fetchMoreResult) {
          return false
        }

        const prevPostFeed = previousResult.channelsConnection.edges
        const newPostFeed =
          fetchMoreResult.channelsConnection.edges

        const newPostsData = {...fetchMoreResult.channelsConnection, 
          edges: [
            ...prevPostFeed,
            ...newPostFeed,
          ]}

        const newData = {
          ...previousResult,
          channelsConnection: newPostsData
        }
        
        return newData
      },
    })
  }
}

export const CHANNEL_FEED_QUERY = gql`
  query ChannelsConnectionQuery($first: Int, $after: String, $orderBy: ChannelOrderByInput) {
    channelsConnection(first: $first, after: $after, orderBy: $orderBy,) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          users {
            id
            firstName
            lastName
          }
          messages {
            createdAt
            id
            text
            to {
              id
              firstName
              lastName
            }
            from {
              id
              firstName
              lastName
            }
          }
        }
      }
      aggregate {
        count
      }
    }
  }
`

export default withStyles(styles)(graphql(CHANNEL_FEED_QUERY, {
 name: 'channelFeedQuery',
 options: ownProps => {
    let after = ownProps.endCursor || null
    return {
      variables: { first: CHANNELS_PER_PAGE, after:after, orderBy: CHANNELS_ORDER_BY }
    }
  },
})(ChannelList))