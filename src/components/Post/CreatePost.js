import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import axios from 'axios'
import moment from 'moment'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Dropzone from 'react-dropzone'
import { FormControl, FormHelperText } from 'material-ui/Form'

import { POST_FEED_QUERY } from './PostList'
import { POSTS_PER_PAGE, POSTS_ORDER_BY } from '../../constants'

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

class CreatePost extends Component {
  state = {
    title: '',
    text: '',
    pictureFile: '',
    pictureURL: '',
    picturePreviewURL: '',
    file: null,
  }

  render() {
    const { classes } = this.props
    const { picturePreviewURL, } = this.state
    let $picturePreview = null

    if( picturePreviewURL ) {
      $picturePreview = (<img src={picturePreviewURL} />)
    }

    return (
      <form className={this.props.container} noValidate autoComplete="off">
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
            id='post'
            label='Post'
            className={this.props.textField}
            multiline={true}
            rows={5}
            rowsMax={8}
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
            margin='normal'
          />
        </FormControl>
        <FormControl fullWidth className={classes.margin}>
          <input type='file' onChange={this._handlePictureChange} />
          {$picturePreview}
        </FormControl>
        <Button variant="raised" color="primary" className={this.props.button} onClick={() => this._createPost()}>
          Post
        </Button>
      </form>
    )
  }
  
  _handlePictureChange = data => {
    let reader = new FileReader()
    let file = data.target.files[0]
    
    reader.onloadend = () => {
      console.log("reader ", reader.result)

      this.setState({
        pictureFile: file, 
        picturePreviewURL: reader.result
      })
    }

    reader.readAsDataURL(file)
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

  _createPost = async () => {
    const { title, text, pictureFile, pictureURL } = this.state
    var pic_url = ''

    if ( pictureFile ) {
      console.log("file name ", pictureFile.name)
      const response = await this.props.s3SignMutation({
        variables: {
          filename: this._formatFilename(pictureFile.name+'.'+pictureFile.type),
          filetype: pictureFile.type
        }
      })

      const { signedRequest, url } = response.data.signS3
      // pictureURL = url
      this.setState({ pictureURL: url })
      
      pic_url = url 
      await this._uploadToS3(pictureFile, signedRequest)
    }
    
    await this.props.postMutation({
      variables: {
        title,
        text,
        pictureURL: pic_url,
      }
      ,
      update: (store, { data: { createPost }}) => {
        const after = null
        const first = POSTS_PER_PAGE
        const orderBy = POSTS_ORDER_BY

        const data = store.readQuery({ query: POST_FEED_QUERY, variables: { first, after, orderBy } })
        console.log("data ", data)
        console.log("createPost ", createPost)
        
        data.postsConnection.edges.splice(0, 0, {node: createPost} )
        
        console.log("data ", data)
        store.writeQuery({
          query: POST_FEED_QUERY,
          data,
          variables: { first, after, orderBy },
        })
      }
    })

    this.props.onClose()
    // this.props.history.push('/')
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

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $text: String!, $pictureURL: String) {
    createPost(title: $title, text: $text, pictureURL: $pictureURL) {
      id
      title
      text
      pictureURL
      createdAt
      postedBy {
        id
        firstName
        lastName
        avatarURL
      }
      postComments {
        id
        text
        user {
          id
          firstName
          lastName
          avatarURL
        }
      }
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
`

export default withStyles(styles)(compose(
  graphql(POST_MUTATION, {name: 'postMutation'}),
  graphql(S3_SIGN_MUTATION, {name: 's3SignMutation'})
)(CreatePost))