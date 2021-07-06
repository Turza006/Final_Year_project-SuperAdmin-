import gql from 'graphql-tag'

export const ALL_SERVICE = gql`
  query {
    AllService {
      Services {
        id
        serviceName
        servicePrice
        ServiceCategory {
          id
          Category
        }
        status
        createdAt
        updatedAt
      }
      msg
      code
    }
  }

`

export const ALL_SERVICE_BY_CATEGORY = gql`
  query($CategoryId: ID) {
    AllServiceByCategory(CategoryId: $CategoryId) {
      Services {
        id
        serviceName
        servicePrice
        ServiceCategory {
          id
          Category
        }
        status
        createdAt
        updatedAt
      }
      msg
      code
    }
  }
`
