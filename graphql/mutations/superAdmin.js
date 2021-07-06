import gql from 'graphql-tag'

export const CREATE_SUPER_ADMIN = gql`
  mutation CreateSuperAdmin($payload: SuperAdminInput) {
    CreateSuperAdmin(payload: $payload) {
      code
      jwt
      msg
    }
  }
`

export const SUPER_ADMIN_STATUS_CHANGE = gql`
  mutation SuperAdminStatusChange($status: SuperAdminStatus, $id: ID) {
    SuperAdminStatusChange(status: $status, id: $id) {
      jwt
      msg
      code
    }
  }`
