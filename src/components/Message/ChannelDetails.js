import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import List from 'material-ui/List'

import Message from './Message'
import CreateMessage from './CreateMessage'

import { ME_ID, MESSAGES_PER_PAGE, MESSAGES_ORDER_BY } from '../../constants'


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

    if (this.props.messageFeedQuery && this.props.messageFeedQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
        )
    }
    
    if (this.props.messageFeedQuery && this.props.messageFeedQuery.error) {
      return <div>Error</div>
    }
    
    console.log("props ", this.props)
    const messagesToRender = this.props.messageFeedQuery.messagesConnection.edges
    console.log("channel details ", messagesToRender)
    return (
      <Paper className={classes.root} elevation={4}>
          {messagesToRender.map((message, index) => 
            <Message key={message.node.id} index={index} message={message.node} />)}
        <CreateMessage id={this.props.id} />
      </Paper>
    )
  }
}

export const MESSAGE_FEED_QUERY = gql`
  query MessagesConnectionQuery($first: Int, $after: String, $orderBy: MessageOrderByInput, $id: String) {
    messagesConnection(first: $first, after: $after, orderBy: $orderBy, id: $id) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          createdAt
          id
          text
          from {
            id
            firstName
            lastName
          }
        }
      }
      aggregate {
        count
      }
    }
  }
`

export default withStyles(styles)(graphql(MESSAGE_FEED_QUERY, {
 name: 'messageFeedQuery',
 options: ownProps => {
    console.log("ownProps ", ownProps)
    let after = ownProps.endCursor || null
    return {
      variables: { first: MESSAGES_PER_PAGE, after:after, orderBy: MESSAGES_ORDER_BY, id: ownProps.id }
    }
  },
})(ChannelList))