import React, { Component } from 'react'

class Post extends Component {
  render() {
    return (
      <div>
        <div>
          {this.props.post.title}
        </div>
      </div>
    )
  }

  _voteForLink = async () => {
    // ... you'll implement this in chapter 6
  }
}

export default Post