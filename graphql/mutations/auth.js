import gql from 'graphql-tag'

export const SUPER_ADMIN_LOGIN = gql`
  mutation SuperAdminLogin(
    $email: String
    $password: String
    $deviceToken: String
  ) {
    SuperAdminLogin(
      email: $email
      password: $password
      deviceToken: $deviceToken
    ) {
      code
      jwt
      msg
    }
  }
`

export const SUPER_ADMIN_EMAIL_VERIFICATION = gql`
  mutation SuperAdminEmailVerification($token: String) {
    SuperAdminEmailVerification(token: $token) {
      id
      firstName
      lastName
      email
      isEmailVerified
      createdAt
      updatedAt
      jwt
      msg
    }
  }
`

export const SUPER_ADMIN_EMAIL_VERIFICATION_RETRY = gql`
  mutation SuperAdminEmailVerificationRetry($email: String) {
    SuperAdminEmailVerificationRetry(email: $email) {
      msg
      code
      jwt
    }
  }
`

export const SUPER_ADMIN_FORGOT_PASSWORD_REQUEST = gql`
  mutation SuperAdminForgetPasswordRequest($email: String) {
    SuperAdminForgetPasswordRequest(email: $email) {
      msg
      jwt
      code
    }
  }`

export const SUPER_ADMIN_PASSWORD_RESET_TOKEN_VERIFY = gql`
  mutation SuperAdminPasswordResetTokenVerify($token: String) {
    SuperAdminPasswordResetTokenVerify(token: $token) {
      msg
      code
      jwt
    }
  }
`

export const SUPER_ADMIN_RESET_PASSWORD_CHANGING = gql`
  mutation SuperAdminResetPasswordChanging($password: String) {
    SuperAdminResetPasswordChanging(password: $password) {
      msg
      code
    }
  }
`
