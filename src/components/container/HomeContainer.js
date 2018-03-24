import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'

import AddIcon from 'material-ui-icons/Add'
import Icon from 'material-ui/Icon';
import Button from 'material-ui/Button';

import PostList from '../Post/PostList'

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'relative',
  },
  button: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
})

class HomeContainer extends Component {
	render() {
		const { classes } = this.props

		return(
			<div>
				<Grid container spacing={24}>
					<Grid item xs={12} sm={3}>
						Hello
	        </Grid>
	        <Grid item xs={12} sm={6}>
	        	<PostList />
	        </Grid>
	        <Grid item xs={12} sm={3}>
	        	Hello
	        </Grid>
				</Grid>
				<Button variant="fab" color="primary" aria-label="add" className={classes.button}>
	        <AddIcon />
	      </Button>
			</div>
			)
	}
}

export default withStyles(styles)(HomeContainer)