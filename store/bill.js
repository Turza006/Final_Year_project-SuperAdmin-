import { getDataWithCustomHeader, getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { API } from '~/utils/apiStatusCode'
import { TOAST } from '~/utils/strings'
import { ALL_BILLING_REQUEST } from '~/graphql/queries'
import { BILLING_STATUS_CHANGE } from '~/graphql/mutations'

export const state = () => ({
  allBillingRequest: {
    BillingRequest: [],
    count: 0
  }
})

export const mutations = {
  SET_ALL_BILLING_REQUEST: (state, payload) => {
    state.allBillingRequest = payload
  },
  BILLING_STATUS_UPDATE: (state, {
    status,
    billingId
  }) => {
    const index = state.allBillingRequest.BillingRequest.findIndex(bill => bill.id === billingId)
    if (index !== -1) {
      state.allBillingRequest.BillingRequest[index].status = status
    }
  }
}

export const actions = {
  requestGetAllBillingRequest: async ({ commit }, {
    $apollo,
    status,
    limit,
    offset,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, ALL_BILLING_REQUEST, {
      status,
      limit,
      offset
    }, { jwt })
    if (data.AllBillingRequest !== null && data.AllBillingRequest.code === API.SUCCESS) {
      await commit('SET_ALL_BILLING_REQUEST', data.AllBillingRequest)
      return {
        code: 'success',
        msg: data.AllBillingRequest.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  },
  requestBillingStatusChange: async ({ commit }, {
    $apollo,
    status,
    ownedPackageId,
    billingId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, BILLING_STATUS_CHANGE, {
      status,
      ownedPackageId
    }, { jwt })
    if (data.BillingStatusChange !== null && data.BillingStatusChange.code === API.EDITED) {
      await commit('BILLING_STATUS_UPDATE', {
        status,
        billingId
      })
      return {
        msg: TOAST.BILLING_STATUS_UPDATED_SUCCESS,
        code: 'success'
      }
    } else {
      return {
        msg: TOAST.BILLING_STATUS_UPDATED_FAILED,
        code: 'error'
      }
    }
  }
}

export const getters = {
  allBillingRequest: ({ allBillingRequest }) => allBillingRequest
}
