import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import { AUTH_TOKEN } from '../../constants'
import { timeDifferenceForDate } from '../../utils'

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

class Gig extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div>
        <Card className={this.props.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              <Link to={`/g/${this.props.gig.id}`}>{this.props.gig.title}</Link>
            </Typography>
            <Typography className={this.props.pos}>
            by{' '}
            {this.props.gig.postedBy
              ? this.props.gig.postedBy.firstName
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.gig.createdAt)}
            </Typography>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>
      </div>
    )
  }

  _likePost = async () => {
    const postId = this.props.post.id
    await this.props.postLikeMutation({
      variables: {
        postId
      },
      update: (store, {data: {postLike}}) => {
        this.props.updateStoreAfterPostLike(store, postLike, postId)
      },
    })
  }
}

const POST_LIKE_MUTATION = gql`
  mutation PostLikeMutation($postId: ID!) {
    postLike(postId: $postId) {
      id
      post {
        postLikes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export default withStyles(styles)(graphql(POST_LIKE_MUTATION, {
  name: 'postLikeMutation',
})(Gig))