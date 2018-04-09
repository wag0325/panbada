import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'
import Typography from 'material-ui/Typography'

import PostList from '../Post/PostList'
import GigList from '../Gig/GigList'

function TabContainer({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
})

class MyActivity extends Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  render() {
    const { classes, theme } = this.props
    const { value } = this.state

    if (this.props.meQuery && this.props.meQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.meQuery && this.props.meQuery.error) {
      return <div>Error</div>
    }
    
    const { me } = this.props.meQuery
    
    return (
      <div className={classes.root}>
        <AppBar position='static' color='default'>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor='primary'
            textColor='primary'
            fullWidth
          >
            <Tab label='My Posts'/>
            <Tab label='My Gigs'/>
          </Tabs>

        </AppBar>
        {value === 0 && <TabContainer><PostList postedById={me.id} /></TabContainer>}
        {value === 1 && <TabContainer><GigList postedById={me.id} /></TabContainer>}
      </div>
    )
  }
}

MyActivity.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

const ME_QUERY = gql`
  query MeQuery {
    me {
      id
      firstName
      lastName
      avatarURL
    }
  }
`

export default withStyles(styles, { withTheme: true })(graphql(ME_QUERY, { name: 'meQuery' })(MyActivity))
