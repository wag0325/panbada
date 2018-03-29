import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'

import { POST_FEED_QUERY } from './PostList'
import { POSTS_PER_PAGE, POSTS_ORDER_BY } from '../../constants'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  inputLabelFocused: {
    color: '#0d4296',
  },
  inputUnderline: {
    '&:after': {
      backgroundColor: '#0d4296',
    },
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  textFieldInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  textFieldFormLabel: {
    fontSize: 18,
  },
  button: {
    margin: theme.spacing.unit,
  },
})

class CreatePostComment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      id: props.id,
      text: '',
      isEntered: false,
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <TextField
          type='text'
          value={this.state.text}
          onChange={(e) => this.setState({ text: e.target.value})}
          InputProps={{
            disableUnderline: true,
            classes: {
              root: classes.textFieldRoot,
              input: classes.textFieldInput,
            },
          }}
        />
        <Button variant="raised" color="default" className={classes.button} onClick={() => this._createPostComment()}>
          Post
        </Button>
      </div>
    )
  }

  _createPostComment = async () => {
    const { id, text } = this.state
    console.log("create ", id, text)

    await this.props.postCommentMutation({
      variables: {
      	id,
        text
      },
      update: (store, {data: {createPostComment}}) => {
        const after = null
        const first = POSTS_PER_PAGE 
        const orderBy = POSTS_ORDER_BY
        let postIndex = null 

      	const data = store.readQuery({ query: POST_FEED_QUERY, variables: { first, after, orderBy } })
        
        const commentedPost = data.postsConnection.edges.find((post, index) => {
          if (post.node.id === id) postIndex = index
          return post.node.id === id
        })
        
        console.log("index ", postIndex)
        
        console.log("createPostComment", createPostComment)
        console.log("commentedPost ", commentedPost)
      
        commentedPost.node.postComments.push(createPostComment)
        console.log("commentedPost ", commentedPost)
        
        console.log("data", data)
        data.postsConnection.edges.splice(postIndex, 1, commentedPost )
        // postComments.push(createPostComment)
        console.log("data", data)
        
		    store.writeQuery({
		      query: POST_FEED_QUERY,
		      data, 
          variables: { first, after, orderBy } 
        })
      },
    })

    this.setState({text: ''})
  }
}

const POST_COMMENT_MUTATION = gql`
  mutation PostCommentMutation($id: ID!, $text: String!) {
    createPostComment (id: $id, text: $text) {
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
`

export default withStyles(styles)(graphql(POST_COMMENT_MUTATION, {name: 'postCommentMutation'})(CreatePostComment))