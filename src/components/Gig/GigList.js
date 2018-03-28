import React, { Component } from 'react'
import Gig from './Gig'
import { Link } from 'react-router-dom'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'

import { GIGS_PER_PAGE, GIGS_ORDER_BY } from '../../constants'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
})

class GigList extends Component {
  render() {
    if (this.props.gigFeedQuery && this.props.gigFeedQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
      )
    }
    
    if (this.props.gigFeedQuery && this.props.gigFeedQuery.error) {
      return <div>Error</div>
    }

    const gigsToRender = this.props.gigFeedQuery.gigsConnection.edges
    
    return (
      <div>
        <Link to='/gigs/new'>
          <Button variant="raised" color="primary" className={this.props.button}>
          Post a gig
          </Button>
        </Link>
        <div>{gigsToRender.map((gig, index) => 
          <Gig key={gig.node.id} index={index} gig={gig.node} />)}
        </div>
      </div>
    )
  }
}

export const GIG_FEED_QUERY = gql`
  query GigsConnectionQuery($first: Int, $after: String, $orderBy: GigOrderByInput) {
    gigsConnection(first: $first, after: $after, orderBy: $orderBy,) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          createdAt
          type
          title
          text
          postedBy {
            id
            firstName
            lastName
            avatarURL
          }
        }
      }
      aggregate {
        count
      }
    }
  }
`
export default withStyles(styles)(graphql(GIG_FEED_QUERY, { 
  name: 'gigFeedQuery',
  options: ownProps => {
    let after = ownProps.endCursor || null
    return {
      variables: { first: GIGS_PER_PAGE, after:after, orderBy: GIGS_ORDER_BY }
    }
  },
})(GigList))