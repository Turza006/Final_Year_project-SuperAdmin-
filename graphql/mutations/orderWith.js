import gql from 'graphql-tag'

export const ADD_ORDER_WITH = gql`
  mutation AddOrderWith($payload: OrderWithInput) {
    AddOrderWith(payload: $payload) {
      msg
      code
    }
  }
`

export const EDIT_ORDER_WITH = gql`
  mutation EditOrderWith($payload: OrderWithInput, $OrderWithId: ID) {
    EditOrderWith(payload: $payload, OrderWithId: $OrderWithId) {
      msg
      code
    }
  }
`
