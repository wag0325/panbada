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
}