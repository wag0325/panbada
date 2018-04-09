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
  newGig: {
    marginBottom: 10
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
    const { postedById } = this.props
    return (
      <div>
        <div className={classes.newGig}>
          <Link to='/gigs/new'>
            <Button variant='raised' color='default' className={this.props.button}>
            Post a gig
            </Button>
          </Link>
        </div>
        <Paper className={classes.root} elevation={4}>
          <List dense={dense}>
            {gigsToRender.length === 0 && 'No gigs near this location. Please select a different region or increase the search radius.'}
            {gigsToRender.map((gig, index) => {
                return (<Gig key={gig.node.id} index={index} gig={gig.node} />)
              })}
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
    $lat: Float, $lng: Float, $distance: Int, $postedById: String) {
    gigsConnection(first: $first, after: $after, orderBy: $orderBy,
      lat: $lat, lng: $lng, distance: $distance, postedById: $postedById,
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
    let lat = null
    let lng = null
    let distance = null
    let postedById = ownProps.postedById || null 
    let location = ownProps.location
    if (location) {
      lat = location.lat
      lng = location.lng 
      distance = location.r
    }

    return {
      variables: { 
        first: GIGS_PER_PAGE, 
        after:after, 
        orderBy: GIGS_ORDER_BY,
        lat: lat,
        lng: lng,
        distance: distance,
        postedById,
      }
    }
  },
})(GigList))