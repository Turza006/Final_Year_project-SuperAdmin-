import { getMutationData, getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { API } from '~/utils/apiStatusCode'
import {
  SUPER_ADMIN_EDIT_PROFILE,
  SUPER_ADMIN_EMAIL_VERIFICATION,
  SUPER_ADMIN_LOGIN,
  SUPER_ADMIN_RESET_PASSWORD_CHANGING
} from '~/graphql/mutations'

const initialState = {
  isAuthenticated: false,
  jwt: '',
  verifyToken: '',
  passwordResetVerifyToken: '',
  newPasswordCreateToken: '',
  user: {},
  resetPass: null
}

export const state = () => (initialState)

export const mutations = {
  SET_TOKEN: (state, payload) => {
    state.isAuthenticated = !!payload.jwt
    state.jwt = payload.jwt
  },
  SET_VERIFY_TOKEN: (state, jwt) => {
    state.verifyToken = jwt
  },
  UNSET_VERIFY_TOKEN: (state) => {
    state.verifyToken = ''
  },
  SET_PASSWORD_RESET_VERIFY_TOKEN: (state, jwt) => {
    state.passwordResetVerifyToken = jwt
  },
  UNSET_PASSWORD_RESET_VERIFY_TOKEN: (state) => {
    state.passwordResetVerifyToken = ''
  },
  SET_NEW_PASSWORD_CREATE_TOKEN: (state, jwt) => {
    state.newPasswordCreateToken = jwt
  },
  UNSET_NEW_PASSWORD_CREATE_TOKEN: (state) => {
    state.newPasswordCreateToken = ''
  },
  SET_USER_DATA: (state, payload) => {
    state.user = payload
  },
  LOGOUT_USER: (state) => {
    const s = initialState
    Object.keys(state).forEach((key) => {
      delete state[key]
    })
    Object.keys(s).forEach((key) => {
      state[key] = s[key]
    })
  }
}

export const actions = {
  requestSuperAdminLogin: async ({ commit, store }, { $apollo, email, password, deviceToken }) => {
    const data = await getMutationData($apollo, SUPER_ADMIN_LOGIN, { email, password, deviceToken })

    if (data.SuperAdminLogin !== null) {
      await commit('SET_VERIFY_TOKEN', data.SuperAdminLogin.jwt)
      return {
        token: data.SuperAdminLogin.jwt
      }
    } else {
      return {
        token: null
      }
    }
  },

  requestVerifyToken: async ({ commit }, { $apollo, token }) => {
    return await $apollo.mutate({
      mutation: SUPER_ADMIN_EMAIL_VERIFICATION,
      variables: token
    })
  },

  requestAdminChangePassword: async ({ commit }, { $apollo, oldPassword, newPassword }) => {
    const data = await getMutationData($apollo, SUPER_ADMIN_RESET_PASSWORD_CHANGING, { oldPassword, newPassword })
    // console.log('requestAdminChangePassword data-->', data)
    if (data.AdminChangePassword.code === API.UPDATED) {
      return {
        code: 'success',
        msg: data.AdminChangePassword.msg
      }
    } else {
      return {
        code: 'error',
        msg: data.AdminChangePassword.msg
      }
    }
  },

  requestEditAdminProfile: async ({ dispatch }, { $apollo, payload, jwt }) => {
    const { data } = await getMutationDataWithCustomHeader($apollo, SUPER_ADMIN_EDIT_PROFILE, { payload }, { jwt })
    if (data.EditAdminProfile.code === API.SUCCESS) {
      await dispatch('requestGetSingleAdminInfo', { $apollo, jwt })
      return {
        code: 'success',
        msg: data.EditAdminProfile.msg
      }
    }
    return {
      code: 'error',
      msg: data.EditAdminProfile.msg
    }
  },

  requestPerformLogout: async ({ commit }) => {
    await commit('LOGOUT_USER')
  }
}

export const getters = {
  user: ({ user }) => user,
  jwt: ({ jwt }) => jwt,
  verifyToken: ({ verifyToken }) => verifyToken,
  resetPass: ({ resetPass }) => resetPass,
  isAuthenticated: ({ isAuthenticated }) => isAuthenticated,
  passwordResetVerifyToken: ({ passwordResetVerifyToken }) => passwordResetVerifyToken,
  newPasswordCreateToken: ({ newPasswordCreateToken }) => newPasswordCreateToken
}
