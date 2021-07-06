import { getDataWithCustomHeader } from '~/utils/apolloApiUtil'
import { API } from '~/utils/apiStatusCode'
import { TOAST } from '~/utils/strings'
import { ALL_OWNER } from '~/graphql/queries'

export const state = () => ({
  allOwner: {
    Owners: [],
    count: 0
  }
})

export const mutations = {
  SET_ALL_OWNER: (state, payload) => {
    state.allOwner = payload
  }
}

export const actions = {
  requestGetAllOwner: async ({ commit }, {
    $apollo,
    filterInput,
    limit,
    offset,
    jwt
  }) => {
    const data = await getDataWithCustomHeader($apollo, ALL_OWNER, { filterInput, limit, offset }, { jwt })
    if (data.AllOwner !== null && data.AllOwner.code === API.SUCCESS) {
      await commit('SET_ALL_OWNER', data.AllOwner)
      return {
        code: 'success',
        msg: data.AllOwner.msg
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
  allOwner: ({ allOwner }) => allOwner
}
