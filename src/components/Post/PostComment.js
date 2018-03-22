import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import Avatar from 'material-ui/Avatar'

import { AUTH_TOKEN } from '../../constants'

class PostComment extends Component {
  render() {
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { user } = this.props.postComment
    return (
    	<ListItem>
        <ListItemAvatar>
          <Avatar aria-label="Recipe" 
              className={this.props.avatar} 
              src={user.avatar_url}
              />
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