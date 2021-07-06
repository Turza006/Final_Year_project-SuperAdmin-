import { getDataWithCustomHeader, getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { API } from '~/utils/apiStatusCode'
import { CREATE_SERVICE, EDIT_SERVICE, SERVICE_STATUS_UPDATE } from '~/graphql/mutations'
import { ALL_SERVICE, ALL_SERVICE_BY_CATEGORY } from '~/graphql/queries/service'
import { TOAST } from '~/utils/strings'

export const state = () => ({
  allService: {
    Services: []
  },
  allServiceByCategory: [],
  singleService: {}
})

export const mutations = {
  SET_ALL_SERVICE: (state, payload) => {
    state.allService = payload
  },
  SET_ALL_SERVICE_BY_CATEGORY: (state, payload) => {
    state.allServiceByCategory = payload
  },
  DELETE_SERVICE: (state, serviceId) => {
    const index = state.allService.Services.findIndex(service => service.id === serviceId)
    if (index !== -1) {
      state.allService.Services.splice(index, 1)
    }
  }
}

export const actions = {
  requestCreateService: async ({ commit }, {
    $apollo,
    payload,
    jwt
  }) => {
    // console.log(payload, jwt)
    const data = await getMutationDataWithCustomHeader($apollo, CREATE_SERVICE, { payload }, { jwt })
    if (data.CreateService.code === API.CREATED) {
      return {
        msg: data.CreateService.msg,
        code: 'success'
      }
    } else {
      return {
        msg: data.CreateService.msg,
        code: 'error'
      }
    }
  },
  requestGetAllService: async ({ commit }, {
    $apollo,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, ALL_SERVICE, {}, { jwt })
    if (data.AllService !== null && data.AllService.code === API.SUCCESS) {
      await commit('SET_ALL_SERVICE', data.AllService)
      return {
        code: 'success',
        msg: data.AllService.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  },
  requestGetAllServiceByCategoryId: async ({ commit }, {
    $apollo,
    CategoryId,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, ALL_SERVICE_BY_CATEGORY, { CategoryId }, { jwt })
    if (data.AllServiceByCategory !== null && data.AllServiceByCategory.code === API.SUCCESS) {
      await commit('SET_ALL_SERVICE', data.AllServiceByCategory)
      return {
        code: 'success',
        msg: data.AllServiceByCategory.msg
      }
    } else {
      return {
        code: 'error',
        msg: TOAST.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER
      }
    }
  },
  requestDeleteService: async ({ commit }, {
    $apollo,
    ServiceId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, SERVICE_STATUS_UPDATE, {
      status: 'DELETED',
      ServiceId
    }, { jwt })
    if (data.ServiceStatusUpdate !== null && data.ServiceStatusUpdate.code === API.UPDATED) {
      await commit('DELETE_SERVICE', ServiceId)
      return {
        msg: TOAST.SERVICE_DELETED,
        code: 'success'
      }
    } else {
      return {
        msg: data.ServiceStatusUpdate.msg,
        code: 'error'
      }
    }
  },
  requestEditService: async ({ commit }, {
    $apollo,
    payload,
    ServiceId,
    jwt
  }) => {
    const data = await getMutationDataWithCustomHeader($apollo, EDIT_SERVICE, {
      payload,
      ServiceId
    }, { jwt })
    if (data.ServiceEdit.code === API.UPDATED) {
      return {
        msg: data.ServiceEdit.msg,
        code: 'success'
      }
    } else {
      return {
        msg: data.ServiceEdit.msg,
        code: 'error'
      }
    }
  }
}

export const getters = {
  allService: ({ allService }) => allService,
  allServiceByCategory: ({ allServiceByCategory }) => allServiceByCategory,
  singleService: ({ singleService }) => singleService
}
