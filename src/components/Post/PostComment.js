import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

class PostComment extends Component {
  render() {
    const { user } = this.props.postComment
    return (
    	<ListItem>
        <ListItemAvatar>
          <Avatar aria-label={`${user.firstName}-${user.lastName}`}
              className={this.props.avatar} 
              src={user.avatarURL || ''}>
              {user.firstName.substring(0,1)}
          </Avatar>
        </ListItemAvatar>
        <Link to={`/u/${user.id}`}><ListItemText
          primary={`${user.firstName} ${user.lastName}`}
        /></Link>
        {this.props.postComment.text}
        <ListItemSecondaryAction>
          4 hours ago
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default PostComment