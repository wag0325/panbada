import React, { Component } from 'react'
import Gig from './Gig'
import { Link } from 'react-router-dom'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import { CircularProgress } from 'material-ui/Progress'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import List from 'material-ui/List'
import Button from 'material-ui/Button'

import { GIGS_PER_PAGE, GIGS_ORDER_BY } from '../../constants'
import { GigFragments, UserFragments } from '../../constants/gqlFragments'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
  loadMoreWrapper: {
    margin: 5,
    marginTop: 20,
    textAlign: 'center',
  },
})

class GigList extends Component {
  state = {
    dense: false,
    hasNextPage: true,
  }

  componentWillReceiveProps(nextProps) {
    const { hasNextPage } = nextProps.gigFeedQuery.gigsConnection.pageInfo
    this.setState({hasNextPage: hasNextPage })
  }

  render() {
    const { dense, hasNextPage } = this.state
    const { classes } = this.props
    let $loadMoreButton = null 

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
    
    if(hasNextPage) {
      $loadMoreButton = 
        (<div className={classes.loadMoreWrapper}>
          <Button variant='raised' className={classes.button} onClick={this._loadMoreRows}>
            Load More
          </Button></div>)
    }

    const gigsToRender = this.props.gigFeedQuery.gigsConnection.edges
    
    return (
      <div>
        <Link to='/gigs/new'>
          <Button variant="raised" color="primary" className={this.props.button}>
          Post a gig
          </Button>
        </Link>
        <Paper className={classes.root} elevation={4}>
          <List dense={dense}>
            {gigsToRender.map((gig, index) => 
            <Gig key={gig.node.id} index={index} gig={gig.node} />)}
          </List>
        </Paper>
        {$loadMoreButton}
      </div>
    )
  }
}

export const GIG_FEED_QUERY = gql`
  query GigsConnectionQuery(
    $first: Int, $after: String, $orderBy: GigOrderByInput,
    $lat: Float, $lng: Float, $distance: Int) {
    gigsConnection(first: $first, after: $after, orderBy: $orderBy,
      lat: $lat, lng: $lng, distance: $distance
    ) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...GigBasic
          postedBy {
            ...Avatar
          }
          location {
            ...Location
          }
        }
      }
      aggregate {
        count
      }
    }
  }
  ${GigFragments.gigBasic}
  ${GigFragments.location}
  ${UserFragments.avatar}
`
export default withStyles(styles)(graphql(GIG_FEED_QUERY, { 
  name: 'gigFeedQuery',
  options: ownProps => {
    let after = ownProps.endCursor || null
    let lat = 40.7585569
    let lng = -73.76543670
    let distance = 25
    return {
      variables: { 
        first: GIGS_PER_PAGE, 
        after:after, 
        orderBy: GIGS_ORDER_BY,
        lat: lat,
        lng: lng,
        distance: distance,
      }
    }
  },
})(GigList))