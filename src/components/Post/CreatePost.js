import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import axios from 'axios'
import moment from 'moment'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Dropzone from 'react-dropzone'

import { POST_FEED_QUERY } from './PostList'
import { POSTS_PER_PAGE } from '../../constants'

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

class CreatePost extends Component {
  state = {
    title: '',
    text: '',
    picture_url: '',
    file: null,
  }

  render() {
    return (
      <form className={this.props.container} noValidate autoComplete="off">
        <TextField
          id="title"
          label="Title"
          className={this.props.textField}
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
          margin="normal"
        />
        <TextField
          id="post"
          label="Post"
          className={this.props.textField}
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
          margin="normal"
        />
        <Dropzone onDrop={this._onDrop}>
          <p>
            Try dropping some files here, or click to select files to upload.
          </p>
        </Dropzone>
        <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._createPost()}>
          Post
        </Button>
      </form>
    )
  }
  
  _formatFilename = filename => {
    const date = moment().format("YYYYMMDD");
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7);
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
    };
    await axios.put(signedRequest, file, options);
  }

  _createPost = async () => {
    const { title, text, file, picture_url } = this.state
    var pic_url = '';

    if ( file ) {
      const response = await this.props.s3SignMutation({
        variables: {
          filename: this._formatFilename(file.name+'.'+file.type),
          filetype: file.type
        }
      })

      const { signedRequest, url } = response.data.signS3
      // picture_url = url
      this.setState({ picture_url: url })
      
      pic_url = url 
      await this._uploadToS3(file, signedRequest)
    }
    
    await this.props.postMutation({
      variables: {
        title,
        text,
        picture_url: pic_url,
      }
      ,
      update: (store, { data: { createPost }}) => {
        const skip = 0
        const first = POSTS_PER_PAGE
        const orderBy = 'createdAt_DESC'

        const data = store.readQuery({ query: POST_FEED_QUERY, variables: { first, skip, orderBy } })
        console.log("data ", data)
        console.log("createPost ", createPost)
        data.postFeed.splice(0, 0, createPost)
        console.log("data ", data)
        store.writeQuery({
          query: POST_FEED_QUERY,
          data,
          variables: { first, skip, orderBy },
        })
      }
    })
    this.props.history.push('/')
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
      });
    };

    reader.readAsDataURL(file);
  }
}

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $text: String!, $picture_url: String) {
    createPost(title: $title, text: $text, picture_url: $picture_url) {
      id
      title
      text
      picture_url
    }
  }
`

const S3_SIGN_MUTATION = gql`
  mutation S3SignMutation($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`;

export default withStyles(styles)(compose(
  graphql(POST_MUTATION, {name: 'postMutation'}),
  graphql(S3_SIGN_MUTATION, {name: 's3SignMutation'})
)(CreatePost))