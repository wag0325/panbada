import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import * as ReactDOM from 'react-dom'

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
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  create: {
    flexBasis: '20%',
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  conversation: {
    flexBasis: '80%',
    overflow: 'auto',
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#fff',
    boxShadow: '1px 1px rgba(0, 0, 0, 0.2)'
  },
  loadMoreWrapper: {
    margin: 5,
    marginTop: 20,
    textAlign: 'center',
  },
  loadMoreButton: {
    padding: 5,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 11,
  }
})

class ChannelList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dense: false,
      hasPreviousPage: true,
      loadMore: false,
    }
  }
  
  componentWillUpdate() {
    const { messageList } = this.refs
    const { loadMore } = this.state
  }

  componentDidUpdate() {
    console.log("state  ", this.state)
    const { messageList } = this.refs
    const { loadMore } = this.state
    if (!loadMore) {
      this._scrollToBottom()
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps ", nextProps)
    const { hasPreviousPage } = nextProps.messageFeedQuery.messagesConnection.pageInfo
    this.setState({hasPreviousPage: hasPreviousPage })
  }

  render() {
    const { dense, hasPreviousPage } = this.state
    const { classes } = this.props
    const meId = localStorage.getItem(ME_ID)
    let $loadMoreButton = null 

    console.log("props ", this.props)

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
          <Button variant='raised' className={classes.loadMoreButton} onClick={this._loadMoreRows}>
            Load More
          </Button></div>)
    }

    const messagesToRender = this.props.messageFeedQuery.messagesConnection.edges
    
    return (
      <div className={classes.root}>
          <div className={classes.conversation} ref='messageList' onScroll={this._onScroll}>
            {$loadMoreButton}
            {messagesToRender.map((message, index) => 
              <Message key={message.node.id} index={index} message={message.node} />)}
          </div>
          <Paper className={classes.create}>
          <CreateMessage id={this.props.id} updateAfterCreate={this._handleCreate}/>
          </Paper>
      </div>
    )
  }
  
  _handleCreate = () => {
    const { loadMore } = this.state
    this.setState({loadMore: false})
  }

  _onScroll = () => {
    const { messageList } = this.refs
    const { loadMore } = this.state
    console.log("scroll ", messageList.scrollTop)

    if (messageList.scrollTop === 0) { 
      this.setState({loadMore: true})
      this._loadMoreRows()
    }
  }

  _scrollToBottom = () => {    
    const { messageList } = this.refs
    const scrollHeight = messageList.scrollHeight
    const height = messageList.clientHeight
    const maxScrollTop = scrollHeight - height
    
    ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
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
          messagesConnection: newPostsData,
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