import React, { Component } from 'react'
import Grid from 'material-ui/Grid'

import GigDetails from '../Gig/GigDetails'

class GigContainer extends Component {
	render() {
		const id = this.props.match.params.id

		return(
			<div>
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

export default GigContainer