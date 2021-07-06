import gql from 'graphql-tag'

export const BILLING_STATUS_CHANGE = gql`
  mutation BillingStatusChange($ownedPackageId: ID, $status: BillingInfoStatus) {
    BillingStatusChange(ownedPackageId: $ownedPackageId, status: $status) {
      msg
      code
    }
  }
`
