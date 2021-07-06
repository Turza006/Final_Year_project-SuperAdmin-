<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card flat tile class="grey lighten-4" elevation="10">
      <v-card-title class="white--text primary">
        Package Details
      </v-card-title>
      <div v-if="!!packageData">
        <p class="px-3 pt-3">
          <span class="subtitle-2">Package Name:</span> {{ packageData.packageName }}
        </p>
        <p class="px-3">
          <span class="subtitle-2">Package Price:</span> {{ packageData.packagePrice }}
        </p>
        <p class="px-3 pb-1">
          <span class="subtitle-2">Package Services:</span>
          <SimpleTableComponent class="mt-2" :table-header="[{'Service': 'serviceName'} , {'Price': 'servicePrice'}]" :table-body="packageData.serviceCovered" />
        </p>
        <hr class="white">
        <v-card-actions class="caption">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on"
              >
                Created At: {{ packageData.createdAt | _timeAgoFromMillis }}
              </span>
            </template>
            <span>{{ packageData.createdAt | _milliToDate }}</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <span
                v-bind="attrs"
                v-on="on"
              >
                Updated At: {{ packageData.updatedAt | _timeAgoFromMillis }}
              </span>
            </template>
            <span>{{ packageData.updatedAt | _milliToDate }}</span>
          </v-tooltip>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { DIALOG_EVENT } from '~/utils/events'
import DateConverterMixin from '~/mixins/DateConverterMixin'
import SimpleTableComponent from '~/components/simpleTable/SimpleTableComponent'

export default {
  name: 'DialogShowPackageDetails',
  components: { SimpleTableComponent },
  mixins: [DateConverterMixin],
  data () {
    return {
      dialog: false,
      packageData: null
    }
  },
  created () {
    this.$nuxt.$on(DIALOG_EVENT.TOGGLE_SHOW_PACKAGE_DETAILS_DIALOG, (data) => {
      this.packageData = data
      this.dialog = !this.dialog
    })
  }
}
</script>
