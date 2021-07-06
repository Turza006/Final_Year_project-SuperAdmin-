import gql from 'graphql-tag'

export const ALL_OWNER = gql`
  query AllOwner($filterInput: OwnerFiltterInput, $limit: Int, $offset: Int) {
    AllOwner(filterInput: $filterInput, limit: $limit, offset: $offset) {
      Owners {
        id
        firstName
        lastName
        email
        phoneNo
        profilePic
        isEmailVerified
        isPhoneVerified
        createdAt
        updatedAt
      }
      count
      msg
      code
    }
  }
`
