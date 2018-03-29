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
    
    console.log("props createmessage ", props)
    this.state = {
      id: props.id,
      text: '',
    }
  }
    
  render() {
    const { classes } = this.props
    console.log("create id ", this.state.id)

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
    }
  }
`

export default withStyles(styles)(compose(
  graphql(CREATE_MESSAGE_MUTATION, {name: 'createMessageMutation'}),
)(CreateMessage))