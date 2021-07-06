import gql from 'graphql-tag'

export const SUPER_ADMIN_EDIT_PROFILE = gql`
  mutation SuperAdminEditProfile($payload: SuperAdminInput) {
    SuperAdminEditProfile(payload: $payload) {
      msg
      code
      jwt
    }
  }`
