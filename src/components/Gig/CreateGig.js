import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {withRouter} from 'react-router-dom'
import gql from 'graphql-tag'
import axios from 'axios'
import moment from 'moment'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

import { GIG_FEED_QUERY } from './GigList'
import { GIGS_PER_PAGE, GIGS_ORDER_BY } from '../../constants'
import { GigFragments, UserFragments } from '../../constants/gqlFragments'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  root: {
    padding: 20,
    marginTop: 20,
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

class CreateGig extends Component {
  state = {
    type: '',
    title: '',
    location: '',
    text: '',  
  }

  render() {
    const { classes } = this.props

    return (
      <Paper className={classes.root} elevation={4}>
        <Typography variant='title' gutterBottom>
         Post a Gig
        </Typography>
        <Typography component='p'>
          Create an awesome gig to collaborate with others.
        </Typography>
        <form className={this.props.container} noValidate autoComplete="off">
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="type"
              label="Type"
              className={this.props.textField}
              value={this.state.type}
              onChange={e => this.setState({ type: e.target.value })}
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="title"
              label="Title"
              className={this.props.textField}
              value={this.state.title}
              onChange={e => this.setState({ title: e.target.value })}
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="location"
              label="Location"
              className={this.props.textField}
              value={this.state.location}
              onChange={e => this.setState({ location: e.target.value })}
              margin="normal"
            />
          </FormControl>
          <FormControl fullWidth className={classes.margin}>
            <TextField
              id="text"
              label="Description"
              multiline={true}
              rows={5}
              rowsMax={8}
              className={this.props.textField}
              value={this.state.text}
              onChange={e => this.setState({ text: e.target.value })}
              margin="normal"
            />
          </FormControl>
          <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._createGig()}>
              Submit
          </Button>
        </form>
      </Paper>
    )
  }
  
  _formatFilename = filename => {
    const date = moment().format("YYYYMMDD");
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
    console.log(cleanFileName)
    const newFilename = `images/${date}-${randomString}-${cleanFileName}`;
    return newFilename.substring(0, 60);
  };

  _uploadToS3 = async (file, signedRequest) => {
    const options = {
      headers: {
        "Content-Type": file.type
      }
    }
    await axios.put(signedRequest, file, options)
  }

  _createGig = async () => {
    const { title, text, type, location, } = this.state
    console.log("location ", location)

    await this.props.createGigMutation({
      variables: {
        type,
        title,
        text,
        location,
      },
      update: (store, { data: { createGig }}) => {
        const after = null
        const first = GIGS_PER_PAGE
        const orderBy = GIGS_ORDER_BY

        const data = store.readQuery({ query: GIG_FEED_QUERY, variables: { first, after, orderBy } })
        console.log("data ", data)

        data.gigsConnection.edges.splice(0, 0, {node: createGig} )
        store.writeQuery({
          query: GIG_FEED_QUERY,
          data,
          variables: { first, after, orderBy },
        })
      }
    })
    
    this.props.history.push('/gigs')
  }
  

  _onDrop = async files => {
    console.log("onDrop " + files[0])
    this.setState({ file: files[0] })
  }

  _handleImageFile = (e) => {
    const reader = new FileReader()
    const file = e.target.files[0]
      
    reader.onload = (upload) => {
      console.log("upload "+ upload.target.result)
      console.log("file "+ file.name + " " + file.type)
      this.setState({
        image_uri: upload.target.result,
        // filename: file.name,
        // filetype: file.type
      })
    }

    reader.readAsDataURL(file)
  }
}

const CREATE_GIG_MUTATION = gql`
  mutation CreateGigMutation($type: String!, $title: String!, $text: String!, $location: String) {
    createGig(type:$type, title: $title, text: $text, location: $location) {
      ...GigBasic
      postedBy {
        ...Avatar
      }
    }
  }
  ${GigFragments.gigBasic}
  ${UserFragments.avatar}
`

const S3_SIGN_MUTATION = gql`
  mutation S3SignMutation($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`

export default withStyles(styles)(compose(
  graphql(CREATE_GIG_MUTATION, {name: 'createGigMutation'}),
  graphql(S3_SIGN_MUTATION, {name: 's3SignMutation'})
)(withRouter(CreateGig)))