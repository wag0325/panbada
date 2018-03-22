import React, { Component } from 'react'
import Gig from './Gig'
import { Link } from 'react-router-dom'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
});

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

    const gigsToRender = this.props.gigFeedQuery.gigFeed
    
    return (
      <div>
        <Link to='/create-gig'>
          <Button variant="raised" color="primary" className={this.props.button}>
          Post a gig
          </Button>
        </Link>
        <div>{gigsToRender.map((gig, index) => 
          <Gig key={gig.id} index={index} gig={gig} />)}
        </div>
      </div>
    )
  }
}

export const GIG_FEED_QUERY = gql`
  query GigFeedQuery {
    gigFeed {
      id
      title
      text
      createdAt
      postedBy {
        firstName
        lastName
        id
      }
    }
  }
`
export default withStyles(styles)(graphql(GIG_FEED_QUERY, { name: 'gigFeedQuery'})(GigList))