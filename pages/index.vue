<template>
  <div class="py-6">
    <Greetings />
    <v-layout class="mb-6">
      <v-flex
        v-for="(items, index) in dashboardItems"
        :key="index"
        xs3
        md3
        sm12
        class="ma-2"
      >
        <v-card class="shadow card-background" flat>
          <v-card-title class="white--text">
            <v-avatar class="primary">
              <v-icon dark>
                {{ items.icon }}
              </v-icon>
            </v-avatar>
            <v-spacer />
            <h3>{{ items.title }}</h3>
          </v-card-title>
          <div class="ml-5 pb-5 white--text">
            <div>{{ items.about }} - <span class="font-weight-bold" style="font-size: 18px">{{ items.amount }}</span></div>
            <div class="mt-2">
              <v-btn text x-small class="primary--text text-decoration-underline px-0" :to="items.to">
                Details
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-card>
          <p class="pt-4 px-2 title-1">
            Billing Request
          </p>
          <BillingRequestDataTableComponent billing-status="PENDING" />
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Greetings from '~/components/dashboard/Greetings'
import BillingRequestDataTableComponent from '~/components/dataTables/BillingRequestDataTableComponent'
export default {
  name: 'HomePage',
  components: { BillingRequestDataTableComponent, Greetings },
  middleware: ['authenticated'],
  data () {
    return {
      dashboardItems: [
        { title: 'Category', icon: 'mdi-view-list', about: 'Total Category', amount: '2', to: '/category' },
        { title: 'Service', icon: 'mdi-view-list-outline', about: 'Total Services', amount: '54', to: '/service' },
        { title: 'Package', icon: 'mdi-package-variant-closed', about: 'Total Package', amount: '10', to: '/package' },
        { title: 'Service Owner', icon: 'mdi-account-group', about: 'Total Owner', amount: '07', to: '/users' }
      ]
    }
  }
}
</script>

<style scoped>
.shadow {
  border-radius: 15px
}

.card-background{
  background: #3A1C71;
  background: -webkit-linear-gradient(to right, #2799d2, #2263b1, #3A1C71);
  background: linear-gradient(to bottom, #2799d2, #2263b1, #3A1C71);
}
</style>
