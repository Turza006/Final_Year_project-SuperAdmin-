import gql from 'graphql-tag'

export const CREATE_SERVICE = gql`
  mutation CreateService($payload: ServiceInput) {
    CreateService(payload: $payload) {
      msg
      code
      jwt
    }
  }
`

export const EDIT_SERVICE = gql`
  mutation ServiceEdit($payload: ServiceInput, $ServiceId: ID) {
    ServiceEdit(payload: $payload, ServiceId: $ServiceId) {
      msg
      code
    }
  }
`

export const SERVICE_STATUS_UPDATE = gql`
  mutation ServiceStatusUpdate($ServiceId: ID, $status: String) {
    ServiceStatusUpdate(ServiceId: $ServiceId, status: $status) {
      msg
      code
      jwt
    }
  }
`
