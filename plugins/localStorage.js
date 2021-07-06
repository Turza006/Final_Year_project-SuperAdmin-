import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: process.env.APP_COOKIE_NAME,
    paths: ['auth']
  })(store)
}
