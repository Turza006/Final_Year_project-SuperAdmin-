import { getDataWithCustomHeader, getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { SUPER_ADMIN_PROFILE_SELF } from '~/graphql/queries'
import { API as api } from '~/utils/apiStatusCode'
import { SUPER_ADMIN_EDIT_PROFILE } from '~/graphql/mutations'
import { TOAST } from '~/utils/strings'

export const state = () => ({
  adminInfo: {}
})

export const mutations = {
  SET_GET_SINGLE_ADMIN_INFO: (state, payload) => {
    state.adminInfo = payload
  }
}

export const actions = {
  requestGetSuperAdminProfileSelf: async ({ commit }, { $apollo, jwt }) => {
    const data = await getDataWithCustomHeader($apollo, SUPER_ADMIN_PROFILE_SELF, {}, { jwt })
    if (data.SuperAdminProfileSelf !== null && data.SuperAdminProfileSelf.code === api.SUCCESS) {
      await commit('SET_GET_SINGLE_ADMIN_INFO', data.SuperAdminProfileSelf)
    }
  },

  requestEditSuperAdminProfile: async ({ commit }, { $apollo, payload, jwt }) => {
    const data = await getMutationDataWithCustomHeader($apollo, SUPER_ADMIN_EDIT_PROFILE, { payload }, { jwt })
    if (data.SuperAdminEditProfile !== null && data.SuperAdminEditProfile.code === api.SUCCESS) {
      return {
        msg: data.SuperAdminEditProfile.msg,
        code: 'success'
      }
    } else {
      return {
        msg: TOAST.EDIT_PROFILE_FAILED,
        code: 'error'
      }
    }
  }
}

export const getters = {
  adminInfo: ({ adminInfo }) => adminInfo
}
