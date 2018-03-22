import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

import { GIG_FEED_QUERY } from './GigList'

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
    margin: theme.spacing.unit,
  },
})

class CreateGig extends Component {
  state = {
    title: '',
    text: '',
    type: '',
  }

  render() {
    return (
      <form className={this.props.container} noValidate autoComplete="off">
        <TextField
          id="type"
          label="Type"
          className={this.props.textField}
          value={this.state.type}
          onChange={e => this.setState({ type: e.target.value })}
          margin="normal"
        />
        <TextField
          id="title"
          label="Title"
          className={this.props.textField}
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
          margin="normal"
        />
        <TextField
          id="text"
          label="Description"
          className={this.props.textField}
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
          margin="normal"
        />
        <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._createGig()}>
            Submit
        </Button>
      </form>
    )
  }

  _createGig = async () => {
    const { title, text, type } = this.state
    await this.props.gigMutation({
      variables: {
        type,
        title,
        text
      },
      update: (store, { data: { createGig }}) => {
        const data = store.readQuery({ query: GIG_FEED_QUERY })
        data.gigFeed.splice(0, 0, createGig)
        store.writeQuery({
          query: GIG_FEED_QUERY,
          data,
        })
      }
    })
    this.props.history.push('/gigs')
  }
}

const GIG_MUTATION = gql`
  mutation GigMutation($type: String!, $title: String!, $text: String!) {
    createGig(type:$type, title: $title, text: $text) {
      id
      type
      title
      text
    }
  }
`

export default withStyles(styles)(graphql(GIG_MUTATION, {name: 'gigMutation'})(CreateGig))