import { UPLOAD_IMAGE_MUTATION } from '~/graphql/mutations'
import { getMutationDataWithCustomHeader } from '~/utils/apolloApiUtil'

export const state = () => ({
  singleUploadImageLink: ''
})

export const mutations = {
  SET_SINGLE_UPLOAD_IMAGE_LINK: (state, payload) => {
    // console.log('SET_SINGLE_UPLOAD_IMAGE_LINK', payload)

    state.singleUploadImageLink = payload.imageLink
  },
  UNSET_SINGLE_UPLOAD_IMAGE_LINK: (state) => {
    // console.log('SET_SINGLE_UPLOAD_IMAGE_LINK')
    state.singleUploadImageLink = ''
  }
}

export const actions = {
  singleUpload: async ({ commit }, { $apollo, file, jwt }) => {
    // console.log('queryVariables=', { file })

    try {
      const data = await getMutationDataWithCustomHeader($apollo, UPLOAD_IMAGE_MUTATION, { file }, { jwt })

      // console.log('singleUpload--res', data.SingleUpload)

      commit('SET_SINGLE_UPLOAD_IMAGE_LINK', { imageLink: data.SingleUpload.imageLink })

      // console.log('uploaded')
      return true
    } catch (err) {
      // console.log('singleUpload---error', err)
      return false
    }
  }
}

export const getters = {
  singleUploadImageLink: ({ singleUploadImageLink }) => singleUploadImageLink
}
