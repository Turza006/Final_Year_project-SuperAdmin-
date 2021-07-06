import gql from 'graphql-tag'

export const SHOW_ALL_PACKAGE = gql`
  query {
    ShowAllPackage {
      Packages {
        id
        packageName
        packagePrice
        serviceCategory {
          Category
        }
        serviceCovered {
          serviceName
          servicePrice
        }
        status
        createdAt
        updatedAt
      }
      code
      msg
    }
  }
`

export const SHOW_ALL_PACKAGE_BY_CATEGORY_ID = gql`
    query ShowAllPackageByCategoryId($CategoryId: ID, $status: String) {
        ShowAllPackageByCategoryId(CategoryId: $CategoryId, status: $status) {
            Packages {
                id
                packageName
                packagePrice
                ServiceCategory {
                    id
                    Category
                }
                serviceCovered {
                    id
                    serviceName
                    servicePrice
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
