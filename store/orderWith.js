import { getDataWithCustomHeader, getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { GET_ALL_ORDER_WITH } from '~/graphql/queries/orderWith'
import { API, DEFAULT_STATUS } from '~/utils/apiStatusCode'
import { TOAST } from '~/utils/strings'
import { ADD_ORDER_WITH, EDIT_ORDER_WITH } from '~/graphql/mutations/orderWith'

export const state = () => ({
  allOrderWith: {
    OrderWiths: [],
    count: 0
  }
})

export const mutations = {
  SET_ALL_ORDER_WITH: (state, payload) => {
    state.allOrderWith = payload
  }
}

export const actions = {
  requestGetAllOrderWith: async ({ commit }, {
    $apollo,
    status,
    limit,
    offset,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, GET_ALL_ORDER_WITH, {
      status,
      limit,
      offset
    }, { jwt })

    if (data.GetAllOrderWithByStatus !== null && data.GetAllOrderWithByStatus.code === API.SUCCESS) {
      await commit('SET_ALL_ORDER_WITH', data.GetAllOrderWithByStatus)
      return {
        code: 'success',
        msg: data.GetAllOrderWithByStatus.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  },
  requestAddOrderWith: async ({ commit }, {
    $apollo,
    payload,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, ADD_ORDER_WITH, {
      payload
    }, { jwt })
    if (data.AddOrderWith.code === API.CREATED) {
      return {
        msg: data.AddOrderWith.msg,
        code: 'success'
      }
    } else {
      return {
        msg: data.AddOrderWith.msg,
        code: 'error'
      }
    }
  },
  requestEditOrderWith: async ({ commit }, {
    $apollo,
    payload,
    OrderWithId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, EDIT_ORDER_WITH, {
      payload,
      OrderWithId
    }, { jwt })
    if (data.EditOrderWith.code === API.EDITED) {
      return {
        msg: data.EditOrderWith.msg,
        code: 'success'
      }
    } else {
      return {
        msg: data.EditOrderWith.msg,
        code: 'error'
      }
    }
  },
  requestDeleteOrderWith: async ({ commit }, {
    $apollo,
    OrderWithId,
    jwt
  }) => {
    const payload = {
      status: DEFAULT_STATUS.DELETED
    }
    const data = await getMutationDataWithCustomHeader($apollo, EDIT_ORDER_WITH, {
      payload,
      OrderWithId
    }, { jwt })
    if (data.EditOrderWith.code === API.EDITED) {
      return {
        msg: TOAST.DELETED,
        code: 'success'
      }
    } else {
      return {
        msg: data.EditOrderWith.msg,
        code: 'error'
      }
    }
  }
}

export const getters = {
  allOrderWith: ({ allOrderWith }) => allOrderWith
}
