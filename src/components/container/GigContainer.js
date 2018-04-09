import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'

import GigDetails from '../Gig/GigDetails'

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

class GigContainer extends Component {
	render() {
		const { classes } = this.props
		const id = this.props.match.params.id

		return(
			<div>
				<Grid container spacing={24}>
					<Grid item xs={12} sm={2}>	        	
	        </Grid>
	        <Grid item xs={12} sm={10}>
	        	<GigDetails gigId={id} />
	        </Grid>
	        <Grid item xs={12} sm={2}>	        	
	        </Grid>
				</Grid>
			</div>
			)
	}
}

export default withStyles(styles)(GigContainer)