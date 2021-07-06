import gql from 'graphql-tag'

export const SUPER_ADMIN_PROFILE_SELF = gql`
  query {
    SuperAdminProfileSelf {
      id
      firstName
      lastName
      email
      isEmailVerified
      createdAt
      updatedAt
      msg
      code
    }
  }
`
