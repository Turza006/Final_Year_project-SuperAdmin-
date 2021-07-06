import gql from 'graphql-tag'

export const GET_ALL_ORDER_WITH = gql`
  query GetAllOrderWithByStatus($status: DefaultStatus, $limit: Int, $offset: Int) {
    GetAllOrderWithByStatus(status: $status, limit: $limit, offset: $offset) {
      OrderWiths {
        id
        name
        logo
        status
        textColour
        FillColour
        customColour
      }
      count
      msg
      code
    }
  }
`
