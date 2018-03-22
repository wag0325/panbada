import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress';
import { LinearProgress } from 'material-ui/Progress';

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
  progress: {
    margin: theme.spacing.unit * 2,
  },
   root: {
    flexGrow: 1,
  },
});

class Gig extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const gig = this.props.gigQuery.gig

    if (this.props.gigQuery && this.props.gigQuery.loading) {
      // return <CircularProgress className={this.props.progress} size={50} />
      return (
        <div className={this.props.root}>
          <LinearProgress />
        </div>
        )
    }

    
    if (this.props.gigQuery && this.props.gigQuery.error) {
      return <div>Error</div>
    }
    
    return (
      <div>
        <div>{gig.type}</div>
        <div>{gig.title}</div>
        <div>by{' '}
            {gig.postedBy
              ? gig.postedBy.firstName
              : 'Unknown'}{' '}
            {timeDifferenceForDate(gig.createdAt)}</div>
        <Button size="small" onClick={() => this._saveGig()}>Save</Button>
        <Button size="small" onClick={() => this._contactGig()}>Contact</Button>
        <h4>Description</h4>
        <div>{gig.text}</div>
      </div>
    )
  }

  _saveGig = async () => {
    const gigId = this.props.gig.id
    await this.props.saveGigMutation({
      variables: {
        gigId
      },
      update: (store, {data: { gigBookmark }}) => {
        this.props.updateStoreAfterPostLike(store, gigBookmark, gigId)
      },
    })
  }
}

export const GIG_QUERY = gql`
  query GigQuery($gigId: ID!) {
    gig(gigId: $gigId) {
      id
      type
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

const SAVE_GIG_MUTATION = gql`
  mutation SaveGigMutation($gigId: ID!) {
    gigBookmark(gigId: $gigId) {
      id
    }
  }
`

export default withStyles(styles)(compose(
  graphql(GIG_QUERY, { 
    name: 'gigQuery',
    options: (props) => ({
      variables: { gigId: props.match.params.id }
    }),
  }),
  graphql(SAVE_GIG_MUTATION, { 
    name: 'saveGigMutation',
  }),
)(Gig))