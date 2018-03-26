import React, { Component } from 'react'
import Channel from './Channel'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import List from 'material-ui/List'

import { ME_ID, CHANNELS_PER_PAGE, CHANNELS_ORDER_BY } from '../../constants'


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

class ChannelList extends Component {
  state = {
    dense: false,
  };

  render() {
    const { dense } = this.state
    const { classes } = this.props
    const meId = localStorage.getItem(ME_ID)

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

    const channelsToRender = this.props.channelFeedQuery.channelsConnection.edges
    
    return (
      <Paper className={classes.root} elevation={4}>
        <List dense={dense}>
          {channelsToRender.map((channel, index) => 
            <Channel key={channel.node.id} index={index} channel={channel.node} />)}
        </List>
      </Paper>
    )
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
            from {
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