import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'

import ResetPassword from '../User/ResetPassword'


const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    padding: 30
  },
  button: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
})

class LoginContainer extends Component {
	state = {
		modalOpen: false,
	}

	render() {
		const { classes } = this.props

		return(
			<div className={classes.root}>
				<Grid container spacing={24}>
	        <Grid item xs={12} sm={4}>
	        </Grid>
	        <Grid item xs={12} sm={4}>
						<Paper className={classes.root} elevation={2}>
	        		<ResetPassword/>
	        	</Paper>
	        </Grid>
	        <Grid item xs={12} sm={4}>
	        </Grid>
				</Grid>
			</div>
			)
	}
}

export default withStyles(styles)(LoginContainer)