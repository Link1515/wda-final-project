export default {
  computed: {
    userInfo () {
      return this.$store.getters['user/userInfo']
    }
  }
}
