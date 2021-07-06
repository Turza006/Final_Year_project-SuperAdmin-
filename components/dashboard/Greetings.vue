<template>
  <div class="pl-2 mb-8">
    <h1 class="primary--text">
      {{ greeting }}, {{ user.firstName }}
    </h1>
    <span class="grey--text">Here whats happen in your B2B ServiceNet account today</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Greetings',
  computed: {
    ...mapGetters('auth', ['user']),
    greeting () {
      const myDate = new Date()
      const hrs = myDate.getHours()
      if (hrs < 12) {
        return 'Good Morning'
      } else if (hrs >= 12 && hrs <= 17) {
        return 'Good Afternoon'
      } else if (hrs >= 17 && hrs <= 24) {
        return 'Good Evening'
      }
      return 'Hello'
    }
  }
}
</script>

<style scoped>
.title-color{
  color: #2263b1;
}
</style>
