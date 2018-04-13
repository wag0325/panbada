// user component for user list
import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import Create from 'material-ui-icons/Create'

import { AUTH_TOKEN, AVATAR_DEFAULT } from '../../constants'
import CreateExperienceModal from './CreateExperienceModal'

const styles = theme => ({
  root: {
  },
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
})

class Experience extends Component {
  constructor(props) {
    super(props)

    this.state = {
      secondary: false,
      anchorEl: null,
      openModal: false,
      myProfile: props.myProfile,
    }
  }
  
  componentWillUpdate() {
    if (this.state.openModal) 
      this.setState({
        anchorEl: null,
        openModal: false
      })
  }

  // componentWillMount() {
  //   this.setState({userId: this.props.user.id})
  // }

  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { secondary, anchorEl, openModal, myProfile, } = this.state
    const { experience, classes, userId } = this.props
    
    let { start, end } = experience
    if (start && !end) end = 'Present'

    return (
      <li className={root}>
        <div>
          <Typography variant='subheading'>{experience.title}</Typography>
          {experience.company && <Typography variant='subheading' color='textSecondary'>{experience.company}</Typography>}
          {start && (<Typography variant='subheading' color='textSecondary'>{start} - {end}</Typography>)}
          {experience.location && <Typography variant='subheading' color='textSecondary'>{experience.location}</Typography>}
        </div>        
        <div className={classes.action}>
          {myProfile && (
            <IconButton 
              className={classes.editExperience} 
              aria-label='Edit Experience'
              onClick={() => this._editExperience()}
              ><Create /></IconButton>)}
        </div>
        { openModal && (<CreateExperienceModal experience={experience} id={userId} open={openModal} />)}
      </li>
    )
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = () => {
    this.setState({ anchorEl: null })
  };
  
  _editExperience = () => {
    this.setState({ openModal: true })
  }
}

export default withStyles(styles)(Experience)