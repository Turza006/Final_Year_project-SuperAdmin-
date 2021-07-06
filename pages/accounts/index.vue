<template>
  <div>
    <v-card flat tile elevation="10" class="grey lighten-4 my-5">
      <v-card-title>
        <v-row class="pa-0 ma-0">
          <v-col>
            Billing Requests
          </v-col>
          <v-spacer />
          <v-col cols="4" class="py-0">
            <v-select
              v-model="selectedStatus"
              :items="billingStatusList"
              filled
              rounded
              dense
              solo
              hint="Filter by Status"
              persistent-hint
            />
          </v-col>
          <v-btn small class="primary mt-2" rounded @click="$nuxt.$emit(toggleAddServiceDialog)">
            <v-icon small>
              mdi-plus
            </v-icon>
            Add Service
          </v-btn>
        </v-row>
      </v-card-title>
      <v-divider/>
      <div class="pa-8">
        <BillingRequestDataTableComponent :billing-status="selectedStatus" />
      </div>
    </v-card>
  </div>
</template>

<script>

import BillingRequestDataTableComponent from '~/components/dataTables/BillingRequestDataTableComponent'
export default {
  name: 'PageAccount',
  components: { BillingRequestDataTableComponent },
  data () {
    return {
      selectedStatus: 'PENDING',
      billingStatusList: ['PENDING', 'SUCCESS', 'REJECTED']
    }
  }
}
</script>

<style scoped>

</style>
