import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { POST_FEED_QUERY } from './PostList'
import { POSTS_PER_PAGE } from '../../constants'

class CreatePostComment extends Component {
	state = {
		postId: '',
		text: '',
		isEntered: false, 
	}
	
	componentDidMount() {
    this.setState({ postId: this.props.postId })
  }

  render() {
    return (
      <div>
        <input
            type='text'
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value})}
          />
        <button onClick={() => this._createPostComment()}>Post</button>
      </div>
    )
  }

  _createPostComment = async () => {
    const { postId, text } = this.state
    await this.props.postCommentMutation({
      variables: {
      	postId,
        text
      },
      update: (store, {data: {createPostComment}}) => {
        const page = this.props.page
        const skip = (page - 1) * POSTS_PER_PAGE
        const first = POSTS_PER_PAGE 
        const orderBy = 'createdAt_DESC'

      	const data = store.readQuery({ query: POST_FEED_QUERY, variables: { first, skip, orderBy } })
        
        const commentedPost = data.postFeed.find((post) => {
          return post.id === postId
        })

        const postComments = commentedPost.postComments

        postComments.push(createPostComment)
        
		    store.writeQuery({
		      query: POST_FEED_QUERY,
		      data, 
          variables: { first, skip, orderBy } 
        })
      },
    })

    this.setState({text: ''})
  }
}

const POST_COMMENT_MUTATION = gql`
  mutation PostCommentMutation($postId: ID!, $text: String!) {
    createPostComment (postId: $postId, text: $text) {
      id
      text
      user {
        firstName
      }
    }
  }
`

export default graphql(POST_COMMENT_MUTATION, {name: 'postCommentMutation'})(CreatePostComment)