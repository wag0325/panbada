import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import List from 'material-ui/List'
import Button from 'material-ui/Button'

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
  loadMoreWrapper: {
    margin: 5,
    marginTop: 20,
    textAlign: 'center',
  },
})

class ChannelList extends Component {
  state = {
    dense: false,
    hasPreviousPage: true,
  }
  
  componentWillReceiveProps(nextProps) {
    const { hasPreviousPage } = nextProps.messageFeedQuery.messagesConnection.pageInfo
    this.setState({hasPreviousPage: hasPreviousPage })
  }

  render() {
    const { dense, hasPreviousPage } = this.state
    const { classes } = this.props
    const meId = localStorage.getItem(ME_ID)
    let $loadMoreButton = null 

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
    
    if(hasPreviousPage) {
      $loadMoreButton = 
        (<div className={classes.loadMoreWrapper}>
          <Button variant='raised' className={classes.button} onClick={this._loadMoreRows}>
            Load More
          </Button></div>)
    }

    console.log("props ", this.props)
    const messagesToRender = this.props.messageFeedQuery.messagesConnection.edges
    console.log("channel details ", messagesToRender)
    return (
      <Paper className={classes.root} elevation={4}>
        {$loadMoreButton}
          {messagesToRender.map((message, index) => 
            <Message key={message.node.id} index={index} message={message.node} />)}
        <CreateMessage id={this.props.id} />
      </Paper>
    )
  }

  _loadMoreRows = () => {
    const { messagesConnection, fetchMore } = this.props.messageFeedQuery
    fetchMore({
      variables: { before: messagesConnection.pageInfo.startCursor },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {

        if (!fetchMoreResult) {
          return false
        }

        const prevFeed = previousResult.messagesConnection.edges
        const newFeed =
          fetchMoreResult.messagesConnection.edges

        const newPostsData = {...fetchMoreResult.messagesConnection, 
          edges: [
            ...newFeed,
            ...prevFeed,
          ]}

        const newData = {
          ...previousResult,
          messagesConnection: newPostsData
        }
        
        return newData
      },
    })
  }
}

export const MESSAGE_FEED_QUERY = gql`
  query MessagesConnectionQuery($last: Int, $before: String, $orderBy: MessageOrderByInput, $id: String) {
    messagesConnection(last: $last, before: $before, orderBy: $orderBy, id: $id) {
      pageInfo {
        startCursor
        hasPreviousPage
      }
      edges {
        node {
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
      aggregate {
        count
      }
    }
  }
`

export default withStyles(styles)(graphql(MESSAGE_FEED_QUERY, {
 name: 'messageFeedQuery',
 options: ownProps => {
    let before = ownProps.startCursor || null
    return {
      variables: { last: MESSAGES_PER_PAGE, before:before, orderBy: MESSAGES_ORDER_BY, id: ownProps.id }
    }
  },
})(ChannelList))