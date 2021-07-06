import { getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { API } from '~/utils/apiStatusCode'
import { CREATE_SERVICE_CATEGORY, EDIT_SERVICE_CATEGORY, SERVICE_CATEGORY_UPDATE_STATUS } from '~/graphql/mutations'
import { TOAST } from '~/utils/strings'
import { ALL_ACTIVE_SERVICE_CATEGORY } from '~/graphql/queries'

export const state = () => ({
  allServiceCategory: {
    Category: []
  }
})

export const mutations = {
  SET_ALL_SERVICE_CATEGORY: (state, payload) => {
    state.allServiceCategory = payload
  },
  UPDATE_SERVICE_CATEGORY: (state, { payload, ServiceCategoryId }) => {
    const index = state.allServiceCategory.Category.findIndex(serviceCategory => serviceCategory.id === ServiceCategoryId)
    if (index !== -1) {
      state.allServiceCategory.Category[index].Category = payload.Category
      state.allServiceCategory.Category[index].status = payload.status
    }
  },
  DELETE_SERVICE_CATEGORY: (state, serviceCategoryId) => {
    const index = state.allServiceCategory.Category.findIndex(serviceCategory => serviceCategory.id === serviceCategoryId)
    if (index !== -1) {
      state.allServiceCategory.Category.splice(index, 1)
    }
  }
}

export const actions = {
  requestCreateCategory: async ({ dispatch, commit }, {
    $apollo,
    payload,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, CREATE_SERVICE_CATEGORY, { payload }, { jwt })
    if (data.CreateServiceCategory.code === API.CREATED) {
      await dispatch('requestGetAllActiveServiceCategory', { $apollo, jwt })
      return {
        msg: data.CreateServiceCategory.msg,
        code: 'success'
      }
    } else {
      return {
        msg: data.CreateServiceCategory.msg,
        code: 'error'
      }
    }
  },
  requestGetAllActiveServiceCategory: async ({ commit }, {
    $apollo,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, ALL_ACTIVE_SERVICE_CATEGORY, {}, { jwt })
    if (data.AllActiveServiceCategory !== null && data.AllActiveServiceCategory.code === API.SUCCESS) {
      await commit('SET_ALL_SERVICE_CATEGORY', data.AllActiveServiceCategory)
      return {
        code: API.SUCCESS,
        msg: data.AllActiveServiceCategory.msg
      }
    } else {
      return {
        code: API.ERROR,
        msg: data.AllActiveServiceCategory.msg
      }
    }
  },
  requestDeleteServiceCategory: async ({ commit }, {
    $apollo,
    ServiceCategoryId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, SERVICE_CATEGORY_UPDATE_STATUS, {
      status: 'DELETED',
      ServiceCategoryId
    }, { jwt })

    if (data.ServiceCategoryUpdateStatus !== null && data.ServiceCategoryUpdateStatus.code === API.UPDATED) {
      await commit('DELETE_SERVICE_CATEGORY', ServiceCategoryId)
      return {
        msg: TOAST.SERVICE_CATEGORY_DELETED,
        code: 'success'
      }
    } else {
      return {
        msg: data.ServiceCategoryUpdateStatus.msg,
        code: 'error'
      }
    }
  },
  requestEditServiceCategory: async ({ dispatch, commit }, {
    $apollo,
    payload,
    ServiceCategoryId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, EDIT_SERVICE_CATEGORY, {
      payload,
      ServiceCategoryId
    }, { jwt })
    if (data.EditServiceCategory.code === API.UPDATED) {
      await commit('UPDATE_SERVICE_CATEGORY', { payload, ServiceCategoryId })
      return {
        msg: data.EditServiceCategory.msg,
        code: 'success'
      }
    } else {
      return {
        msg: data.EditServiceCategory.msg,
        code: 'error'
      }
    }
  }

}

export const getters = {
  allServiceCategory: ({ allServiceCategory }) => allServiceCategory
}
