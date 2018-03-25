import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button';

import { POST_FEED_QUERY } from './PostList'
import { POSTS_PER_PAGE } from '../../constants'

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
	state = {
		id: '',
		text: '',
		isEntered: false, 
	}
	
	componentDidMount() {
    this.setState({ id: this.props.id })
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <TextField
          defaultValue="Add a comment..."
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
    await this.props.postCommentMutation({
      variables: {
      	id,
        text
      },
      // update: (store, {data: {createPostComment}}) => {
      //   const page = this.props.page
      //   const first = POSTS_PER_PAGE 
      //   const orderBy = 'createdAt_DESC'

      // 	const data = store.readQuery({ query: POST_FEED_QUERY, variables: { first, orderBy } })
        
      //   const commentedPost = data.postsConnection.edges.find((post) => {
      //     return post.node.id === postId
      //   })

      //   const postComments = commentedPost.postComments

      //   postComments.push(createPostComment)
        
		    // store.writeQuery({
		    //   query: POST_FEED_QUERY,
		    //   data, 
      //     variables: { first, orderBy } 
      //   })
      // },
    })

    this.setState({text: ''})
  }
}

const POST_COMMENT_MUTATION = gql`
  mutation PostCommentMutation($id: ID!, $text: String!) {
    createPostComment (id: $id, text: $text) {
      createdAt
      id
      text
      user {
        id
        firstName
        lastName
      }
    }
  }
`

export default withStyles(styles)(graphql(POST_COMMENT_MUTATION, {name: 'postCommentMutation'})(CreatePostComment))