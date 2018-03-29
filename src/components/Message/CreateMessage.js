import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { FormControl, FormHelperText } from 'material-ui/Form'

import { MESSAGE_FEED_QUERY } from './ChannelDetails'
import { MESSAGES_PER_PAGE, MESSAGES_ORDER_BY } from '../../constants'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
})

class CreateMessage extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      id: props.id,
      text: '',
    }
  }
    
  render() {
    const { classes } = this.props

    return (
      <form className={this.props.container} noValidate autoComplete="off">
        <FormControl fullWidth className={classes.margin}>
          <TextField
            id='message'
            label='Message'
            className={this.props.textField}
            multiline={true}
            rows={5}
            rowsMax={8}
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
            margin='normal'
          />
        </FormControl>
        <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._createMessage()}>
          Post
        </Button>
      </form>
    )
  }

  _createMessage = async () => {
    const { text, id } = this.state
    
    console.log("id ", id)

    await this.props.createMessageMutation({
      variables: {
        text,
        id
      },
      update: (store, { data: { createMessage }}) => {
        const after = null
        const first = MESSAGES_PER_PAGE
        const orderBy = MESSAGES_ORDER_BY
        
        console.log("store ", store)
        
        const data = store.readQuery({ query: MESSAGE_FEED_QUERY, variables: { first, after, orderBy, id } })
        console.log("data ", data)
        console.log("createPost ", createMessage)
        
        console.log("edges ", data.messagesConnection)
        // if ( data.messagesConnection.edges ) {
        // data.messagesConnection.edges.push({node: createMessage} )
        // } else { console.log("no edges!")}
        // console.log("data ", data)
        // store.writeQuery({
        //   query: MESSAGE_FEED_QUERY,
        //   data,
        //   variables: { first, after, orderBy, id },
        // })
      }
    })
  }
  

  _onDrop = async files => {
    console.log("onDrop " + files[0])
    this.setState({ file: files[0] })
  }
}

const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessageMutation($text: String!, $id: String!) {
    createMessage(text: $text, id: $id) {
      id
      createdAt
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
      channel {
        id
      }
    }
  }
`

export default withStyles(styles)(compose(
  graphql(CREATE_MESSAGE_MUTATION, {name: 'createMessageMutation'}),
)(CreateMessage))