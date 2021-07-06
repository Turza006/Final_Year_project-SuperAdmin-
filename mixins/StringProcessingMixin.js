export default {
  methods: {
    getProductName (name, length) {
      return name.length <= length ? name : name.substring(0, length - 3) + '...'
    }
  }
}
