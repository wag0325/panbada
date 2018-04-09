import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import { withStyles } from 'material-ui/styles'

import GigDetails from '../Gig/GigDetails'

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

class GigContainer extends Component {
	render() {
		const id = this.props.match.params.id
		const { classes } = this.props
		
		return(
			<div className={classes.root}>
				<Grid container spacing={24}>
					<Grid item xs={12} sm={3}>	        	
	        </Grid>
	        <Grid item xs={12} sm={6}>
	        	<GigDetails gigId={id} />
	        </Grid>
	        <Grid item xs={12} sm={3}>	        	
	        </Grid>
				</Grid>
			</div>
			)
	}
}

export default withStyles(styles)(GigContainer)