import gql from 'graphql-tag'

export const ALL_ACTIVE_SERVICE_CATEGORY = gql`
  query {
    AllActiveServiceCategory {
      Category {
        id
        Category
        status
      }
      code
      msg
    }
  }
`
