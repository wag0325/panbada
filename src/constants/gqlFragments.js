import gql from 'graphql-tag'

export const UserFragments = {
  basicInfo: gql`
	  fragment BasicUserInfo on User {
	    id
	    email
	    firstName
	    lastName
	    avatarURL
	  }
	`,
	avatar: gql`
	  fragment Avatar on User {
	    id
	    firstName
	    lastName
	    avatarURL
	  }
	`,
}

export const PostFragments = {
	postBasic: gql`
	  fragment PostBasic on Post {
	    id
	    createdAt
	    title
	    text
	    pictureURL
	  }
	`,
	postLike: gql`
		fragment PostLike on PostLike {
      id
      user {
        id
      }
		}
	`,
	postBookmark: gql`
		fragment PostBookmark on PostBookmark {
      id
      user {
        id
      }
		}
	`,
	postComment: gql`
		fragment PostComment on PostComment {
			id
      createdAt
      text
      user {
        id
		    firstName
		    lastName
		    avatarURL
      }
		}
	`,
}
