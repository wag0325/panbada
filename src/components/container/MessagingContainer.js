import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'

import ChannelList from '../Message/ChannelList'
import ChannelDetails from '../Message/ChannelDetails'

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 80,
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    margin: theme.spacing.unit,
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
})

class UsersContainer extends Component {
	state = {
		modalOpen: false,
	}

	render() {
		const { classes } = this.props
		const id = this.props.match.params.id
		const $noChannels = (<div>There is no conversations.</div>)

		return(
			<div>
				<Grid container spacing={24} className={classes.root}>
	        <Grid item xs={12} sm={3}>
	        	{id ? <ChannelList currChannel={id}/> : $noChannels}
	        </Grid>
	        <Grid item xs={12} sm={6}>
	        	<ChannelDetails id={id}/>
	        </Grid>
	        <Grid item xs={12} sm={3}>
	        </Grid>
				</Grid>
			</div>
			)
	}
}

export default withStyles(styles)(UsersContainer)