export default {
  methods: {
    _validEmail (email) {
      const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEx.test(email)) {
        return true
      } else {
        this.$notifier.showMessage({
          content: 'Valid email required.',
          color: 'error'
        })
        return false
      }
    }
  }
}
