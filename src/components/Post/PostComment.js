import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

import { AVATAR_DEFAULT } from '../../constants'
import { timeDifferenceForDate } from '../../utils'

const styles = theme => ({
  comment: {
    fontSize: 13,
    padding: 10,
  },
  commentAction: {
    fontSize: 13,
  },
  avatar: {
    height: 25,
    width: 25,
  },
})

class PostComment extends Component {
  render() {
    const { user } = this.props.postComment
    const { postComment, classes } = this.props

    return (
    	<ListItem className={classes.comment}>
        <ListItemAvatar>
          <Avatar aria-label={`${user.firstName}-${user.lastName}`}
              className={classes.avatar} 
              src={user.avatarURL || AVATAR_DEFAULT} />
        </ListItemAvatar>
        <Link to={`/u/${user.id}`}><ListItemText
          primary={`${user.firstName} ${user.lastName}`}
        /></Link>
        {postComment.text}
        <ListItemSecondaryAction className={classes.commentAction}>
          {timeDifferenceForDate(postComment.createdAt)}
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default withStyles(styles)(PostComment)