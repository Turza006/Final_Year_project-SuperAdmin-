import gql from 'graphql-tag'

export const CREATE_PACKAGE = gql`
  mutation createPackage($payload: PackageInput) {
    createPackage(payload: $payload) {
      msg
      code
    }
  }
`
export const EDIT_PACKAGE = gql`
  mutation editPackage($payload: PackageInput, $packageId: ID) {
    editPackage(payload: $payload, packageId: $packageId) {
      msg
      code
    }
  }
`

export const DELETE_PACKAGE = gql`
  mutation deletePackage($packageId: ID) {
    deletePackage(packageId: $packageId) {
      msg
      code
    }
  }
`
