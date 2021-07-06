import { getDataWithCustomHeader, getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { API } from '~/utils/apiStatusCode'
import { TOAST } from '~/utils/strings'
import { ALL_SUPER_ADMIN } from '~/graphql/queries'
import { SUPER_ADMIN_STATUS_CHANGE } from '~/graphql/mutations'

export const state = () => ({
  allSuperAdmin: []
})

export const mutations = {
  SET_ALL_SUPER_ADMIN: (state, payload) => {
    state.allSuperAdmin = payload
  },
  UPDATE_ADMIN_STATUS: (state, admin) => {
    const index = state.allSuperAdmin.findIndex(service => service.id === admin.id)
    if (index !== -1) {
      state.allSuperAdmin[index].status = admin.status
    }
  }
}

export const actions = {
  requestGetAllSuperAdmin: async ({ commit }, {
    $apollo,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, ALL_SUPER_ADMIN, {}, { jwt })
    if (data.AllSuperAdmin !== null && data.AllSuperAdmin.code === API.SUCCESS) {
      await commit('SET_ALL_SUPER_ADMIN', data.AllSuperAdmin.SuperAdmin)
      return {
        code: 'success',
        msg: data.AllSuperAdmin.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  },
  requestSuperAdminStatusChange: async ({ commit }, {
    $apollo,
    status,
    id,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, SUPER_ADMIN_STATUS_CHANGE, { status, id }, { jwt })
    if (data.SuperAdminStatusChange !== null && data.SuperAdminStatusChange.code === API.UPDATED) {
      await commit('UPDATE_ADMIN_STATUS', { status, id })
      return {
        code: 'success',
        msg: data.SuperAdminStatusChange.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  }
}

export const getters = {
  allSuperAdmin: ({ allSuperAdmin }) => allSuperAdmin
}
