import gql from 'graphql-tag'

export const ALL_BILLING_REQUEST = gql`
  query AllBillingRequest($status: String, $limit: Int, $offset: Int) {
    AllBillingRequest(status: $status, limit: $limit, offset: $offset) {
      BillingRequest {
        id
        billPaidBy {
          id
          firstName
          lastName
          profilePic
          email
        }
        billingSystem
        billingNumber
        billingAddress
        billingAmount
        OwnedPackageId{
          _id
        }
        packageId {
          id
          packageName
          serviceCategory {
            Category
          }
          packagePrice
        }
        status
        createdAt
        updatedAt
      }
      count
      code
      msg
    }
  }
`
