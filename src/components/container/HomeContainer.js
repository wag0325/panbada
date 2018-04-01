import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'

import Dialog, { DialogTitle } from 'material-ui/Dialog'

import PostList from '../Post/PostList'
import PostModalContainer from './PostModalContainer'


const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    marginTop: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
})

class HomeContainer extends Component {
	state = {
		modalOpen: false,
	}

	render() {
		const { classes } = this.props

		return(
			<div className={classes.root}>
				<Grid container spacing={24}>
					<Grid item xs={12} sm={3}>
	        </Grid>
	        <Grid item xs={12} sm={6}>
	        	<PostList />
	        </Grid>
	        <Grid item xs={12} sm={3}>
	        </Grid>
				</Grid>
	      <PostModalContainer />
			</div>
			)
	}

	_handleModalOpen = () => {
		this.setState({ modalOpen: true, })
	}

	_handleModalClose = () => {
		this.setState({ modalOpen: false, })
	}
}

export default withStyles(styles)(HomeContainer)