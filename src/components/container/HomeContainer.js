import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'

import PostList from '../Post/PostList'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
})

class HomeContainer extends Component {
	render() {
		return(
			<div>
				<Grid container spacing={24}>
					<Grid item xs={0} sm={3}>
						Hello
	        </Grid>
	        <Grid item xs={12} sm={6}>
	        	<PostList />
	        </Grid>
	        <Grid item xs={0} sm={3}>
	        	Hello
	        </Grid>
				</Grid>
			</div>
			)
	}
}

export default HomeContainer