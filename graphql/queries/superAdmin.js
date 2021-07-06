import gql from 'graphql-tag'

export const ALL_SUPER_ADMIN = gql`
  query{
    AllSuperAdmin{
      SuperAdmin{
        id
        firstName
        lastName
        email
        isEmailVerified
        status
        createdAt
        updatedAt
      }
      msg
      code
    }
  }`

export const SUPER_ADMIN_PROFILE_BY_ID = gql`
  query SuperAdminProfileByID($SuperAdminId: ID) {
    SuperAdminProfileByID(SuperAdminId: $SuperAdminId) {
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
