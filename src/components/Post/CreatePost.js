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

import { PostFragments, UserFragments } from '../../constants/gqlFragments'
import { POST_FEED_QUERY } from './PostList'
import { POSTS_PER_PAGE, POSTS_ORDER_BY, POSTS_IMAGE_MAX_SIZE, } from '../../constants'
import { formatFilename, uploadToS3 } from '../../utils/handleFile'

import FeedbackMessage from '../Util/FeedbackMessage'

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
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
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
    errors: [],
  }
  
  componentWillUpdate() {
    if (this.state.errors.length > 0 ) this.setState({errors: []})
  }

  render() {
    const { classes } = this.props
    const { picturePreviewURL, } = this.state
    let $picturePreview = null

    if( picturePreviewURL ) {
      $picturePreview = (<img src={picturePreviewURL} />)
    }
    
    const { errors } = this.state
    let $errorMessage = null
    if (errors.length > 0) {
      $errorMessage = (<FeedbackMessage type='error' message={errors[0].message} />)
    }

    return (
      <div>
      <form className={this.props.container} noValidate autoComplete="off">
        <FormControl fullWidth className={classes.margin}>
          <TextField
            required
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
        <Button variant="raised" color="primary" className={classes.button} onClick={() => this._createPost()}>
          Post
        </Button>
      </form>
      {$errorMessage}
      </div>
    )
  }
  
  _handlePictureChange = data => {
    let reader = new FileReader()
    let file = data.target.files[0]
    
    if (file && file.size > POSTS_IMAGE_MAX_SIZE) {
      this.setState({errors: [{message: 'File size too big.'}]})
      return
    }

    reader.onloadend = () => {
      this.setState({
        pictureFile: file, 
        picturePreviewURL: reader.result
      })
    }

    reader.readAsDataURL(file)
  }

  _createPost = async () => {
    const { title, text, pictureFile, pictureURL } = this.state
    let pic_url = ''
    
    if (pictureFile && pictureFile.size > POSTS_IMAGE_MAX_SIZE) 
      this.setState({errors: [{message: 'File size too big'}]})

    if ( pictureFile && pictureFile.size < POSTS_IMAGE_MAX_SIZE) {
      const response = await this.props.s3SignMutation({
        variables: {
          filename: formatFilename(pictureFile.name+'.'+pictureFile.type),
          filetype: pictureFile.type
        }
      })

      const { signedRequest, url } = response.data.signS3
      
      this.setState({ pictureURL: url })
      
      pic_url = url 
      await uploadToS3(pictureFile, signedRequest)
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
        const filter = null 

        const data = store.readQuery({ query: POST_FEED_QUERY, variables: { first, after, orderBy, filter, } })
        
        data.postsConnection.edges.splice(0, 0, {node: createPost} )

        store.writeQuery({
          query: POST_FEED_QUERY,
          data,
          variables: { first, after, orderBy, filter, },
        })
      }
    })
    .then(res => {
        if (!res.errors) {
          this.props.onClose()
        } else {
            // handle errors with status code 200
            console.log('200 errors ', res.errors)
            if (res.errors.length > 0) this.setState({errors: res.errors})
        }
      })
      .catch(e => {
        // GraphQL errors can be extracted here
        if (e.graphQLErrors) {
            console.log('catch errors ', e.graphQLErrors)
            this.setState({errors: e.graphQLErrors})
        }
       }) 
  }

  // _handleTextChange = data => {
  //   console.log("data", data.target.value)
  //   LinkPreview.getPreview(data.target.value).then(data => console.debug(data))
  //   this.setState({ text: data.target.value })
  // }
}

const POST_MUTATION = gql`
  mutation PostMutation($title: String!, $text: String!, $pictureURL: String) {
    createPost(title: $title, text: $text, pictureURL: $pictureURL) {
      ...PostBasic
      postLikes {
        ...PostLike
      }
      postBookmarks {
        ...PostBookmark
      }
      postedBy {
        ...Avatar
      }
      postComments {
        ...PostComment
      }
    }
  }
  ${PostFragments.postBasic}
  ${PostFragments.postComment}
  ${PostFragments.postLike}
  ${PostFragments.postBookmark}
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
  graphql(POST_MUTATION, {name: 'postMutation'}),
  graphql(S3_SIGN_MUTATION, {name: 's3SignMutation'})
)(CreatePost))