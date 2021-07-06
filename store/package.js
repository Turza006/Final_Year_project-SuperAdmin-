import { getDataWithCustomHeader, getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { API as api, API } from '~/utils/apiStatusCode'
import { CREATE_PACKAGE, DELETE_PACKAGE, EDIT_PACKAGE } from '~/graphql/mutations'
import { TOAST } from '~/utils/strings'
import { SHOW_ALL_PACKAGE, SHOW_ALL_PACKAGE_BY_CATEGORY_ID } from '~/graphql/queries'

export const state = () => ({
  allPackage: [],
  allPackageByCategory: []
})

export const mutations = {
  SET_ALL_PACKAGE: (state, payload) => {
    state.allPackage = payload
  },
  SET_ALL_PACKAGE_BY_CATEGORY: (state, payload) => {
    state.allPackageByCategory = payload
  },
  DELETE_PACKAGE: (state, packageId) => {
    const index = state.allPackage.findIndex(pkg => pkg.id === packageId)
    if (index !== -1) {
      state.allPackage[index].status = api.DELETED
      // state.allPackage.splice(index, 1)
    }
  }
}

export const actions = {
  requestCreatePackage: async ({ commit }, {
    $apollo,
    payload,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, CREATE_PACKAGE, { payload }, { jwt })
    if (data.createPackage !== null && data.createPackage.code === API.CREATED) {
      return {
        msg: data.createPackage.msg,
        code: 'success'
      }
    } else {
      return {
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER,
        code: 'error'
      }
    }
  },
  requestGetAllPackage: async ({ commit }, {
    $apollo,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, SHOW_ALL_PACKAGE, {}, { jwt })
    if (data.ShowAllPackage !== null && data.ShowAllPackage.code === API.SUCCESS) {
      await commit('SET_ALL_PACKAGE', data.ShowAllPackage.Packages)
      return {
        code: 'success',
        msg: data.ShowAllPackage.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  },
  requestGetAllPackageByCategoryId: async ({ commit }, {
    $apollo,
    CategoryId,
    status,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, SHOW_ALL_PACKAGE_BY_CATEGORY_ID, { CategoryId, status }, { jwt })
    if (data.ShowAllPackageByCategoryId !== null && data.ShowAllPackageByCategoryId.code === API.SUCCESS) {
      await commit('SET_ALL_PACKAGE', data.ShowAllPackageByCategoryId.Packages)
      return {
        code: 'success',
        msg: data.ShowAllPackageByCategoryId.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  },
  requestDeletePackage: async ({ commit }, {
    $apollo,
    packageId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, DELETE_PACKAGE, {
      status: 'DELETED',
      packageId
    }, { jwt })
    if (data.deletePackage !== null && data.deletePackage.code === API.DELETED) {
      await commit('DELETE_PACKAGE', packageId)
      return {
        msg: TOAST.PACKAGE_DELETED,
        code: 'success'
      }
    } else {
      return {
        msg: data.deletePackage.msg,
        code: 'error'
      }
    }
  },
  requestEditPackage: async ({ commit }, {
    $apollo,
    payload,
    packageId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, EDIT_PACKAGE, {
      payload,
      packageId
    }, { jwt })
    if (data.editPackage.code === API.UPDATED) {
      return {
        msg: data.editPackage.msg,
        code: 'success'
      }
    } else {
      return {
        msg: data.editPackage.msg,
        code: 'error'
      }
    }
  }
}

export const getters = {
  allPackage: ({ allPackage }) => allPackage,
  allPackageByCategory: ({ allPackageByCategory }) => allPackageByCategory
}
