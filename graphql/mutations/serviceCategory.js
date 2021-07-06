import gql from 'graphql-tag'

export const CREATE_SERVICE_CATEGORY = gql`
  mutation CreateServiceCategory($payload: ServiceCategoryInput) {
    CreateServiceCategory(payload: $payload) {
      msg
      code
      jwt
    }
  }
`

export const EDIT_SERVICE_CATEGORY = gql`
  mutation EditServiceCategory(
    $payload: ServiceCategoryInput
    $ServiceCategoryId: ID
  ) {
    EditServiceCategory(
      payload: $payload
      ServiceCategoryId: $ServiceCategoryId
    ) {
      msg
      code
      jwt
    }
  }
`

export const SERVICE_CATEGORY_UPDATE_STATUS = gql`
  mutation ServiceCategoryUpdateStatus($status: String, $ServiceCategoryId: ID) {
    ServiceCategoryUpdateStatus(
      status: $status
      ServiceCategoryId: $ServiceCategoryId
    ) {
      msg
      code
      jwt
    }
  }
`
