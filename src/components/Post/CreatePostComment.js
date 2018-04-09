import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import PropTypes from 'prop-types'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Send from 'material-ui-icons/Send'

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
        <FormControl fullWidth className={classes.formControl}>
            <Input
              id="adornment-password"
              type='text'
              placeholder='Add a comment...'
              value={this.state.text}
              onChange={(e) => this.setState({ text: e.target.value})}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => this._createPostComment()}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              }
            />
        </FormControl>
      </div>
    )
  }

  _createPostComment = async () => {
    const { id, text } = this.state

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
        
        commentedPost.node.postComments.push(createPostComment)
        data.postsConnection.edges.splice(postIndex, 1, commentedPost )
        // postComments.push(createPostComment)
        
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
      createdAt
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