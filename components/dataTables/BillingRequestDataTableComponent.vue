<template>
  <v-data-table
    :headers="headers"
    :items="allBillingRequest.BillingRequest"
    :search="search"
    :loading="loading"
    :options.sync="options"
    :server-items-length="allBillingRequest.count"
    class="grey lighten-4"
  >
    <template #[`item.billPaidBy`]="{ item }">
      <div>
        <v-avatar v-if="item.billPaidBy !== null && item.billPaidBy.profilePic !== null" class="my-2">
          <img
            :src="imgBaseUrl + item.billPaidBy.profilePic"
            :alt="item.billPaidBy !== null ? item.billPaidBy.firstName : ''"
          >
        </v-avatar>
        <v-avatar v-else class="my-2">
          <v-icon>
            mdi-account
          </v-icon>
        </v-avatar>
        {{ item.billPaidBy !== null ? getFullName(item.billPaidBy) : '' }}
      </div>
    </template>
    <template #[`item.isPhoneVerified`]="{ item }">
      <v-chip
        :color="item.isPhoneVerified ? 'success' : 'error'"
        small
        dark
      >
        {{ item.isPhoneVerified ? 'Yes' : 'No' }}
      </v-chip>
    </template>
    <template #[`item.billingAmount`]="{ item }">
      <div v-if="item.packageId !== null">
        <span v-if="item.billingAmount === item.packageId.packagePrice">
          {{ item.billingAmount }}
        </span>
        <v-chip
          v-else
          :color=" item.billingAmount > item.packageId.packagePrice ? 'info' : 'error'"
          dark
          small
        >
          {{ item.billingAmount }}
        </v-chip>
      </div>
      <div v-else>
        {{ item.billingAmount }}
      </div>
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip
        :color=" item.status === 'PENDING' ? 'warning' : item.status === 'SUCCESS' ? 'success' : 'error' "
        dark
        small
      >
        {{ item.status }}
      </v-chip>
    </template>
    <template #[`item.createdAt`]="{item}">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
          >
            {{ item.createdAt | _timeAgoFromMillis }}
          </span>
        </template>
        <span>{{ item.createdAt | _milliToDate }}</span>
      </v-tooltip>
    </template>
    <template #[`item.updatedAt`]="{item}">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
          >
            {{ item.updatedAt | _timeAgoFromMillis }}
          </span>
        </template>
        <span>{{ item.updatedAt | _milliToDate }}</span>
      </v-tooltip>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        v-if="item.status === 'PENDING'"
        class="ma-1"
        small
        outlined
        color="success"
        @click="acceptBilling(item)"
      >
        <v-icon small class="mr-1">
          mdi-check
        </v-icon>
        Accept
      </v-btn>
      <v-btn
        v-if="item.status === 'PENDING'"
        class="ma-1"
        small
        outlined
        color="error"
        @click="rejectBilling(item)"
      >
        <v-icon small class="mr-1">
          mdi-cancel
        </v-icon>
        Reject
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'
import { BILLING_STATUS } from '~/utils/apiStatusCode'

export default {
  name: 'BillingRequestDataTableComponent',
  mixins: [DateConverterMixin],
  props: {
    billingStatus: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      imgBaseUrl: process.env.IMAGE_BASE_URL,
      search: '',
      headers: [
        {
          text: 'Bill Paid By',
          value: 'billPaidBy'
        },
        {
          text: 'Billing System',
          value: 'billingSystem'
        },
        {
          text: 'Billing Number',
          value: 'billingNumber'
        },
        // {
        //   text: 'Billing Address',
        //   value: 'billingAddress'
        // },
        {
          text: 'Package Name',
          value: 'packageId.packageName'
        },
        {
          text: 'Package Price',
          value: 'packageId.packagePrice'
        },
        {
          text: 'Amount',
          value: 'billingAmount'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Created at ',
          value: 'createdAt'
        },
        {
          text: 'Updated at ',
          value: 'updatedAt'
        },
        {
          text: 'Actions  ',
          value: 'actions'
        }
      ],
      options: {
        page: 1,
        itemsPerPage: 5,
        pageCount: 0,
        itemsLength: 0
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['jwt']),
    ...mapGetters('bill', ['allBillingRequest'])
  },
  watch: {
    billingStatus () {
      if (this.options.page === 1) {
        this.getAllBillingRequestNetworkCall()
      } else {
        this.options.page = 1
      }
    },
    options: {
      deep: true,
      handler () {
        this.getAllBillingRequestNetworkCall()
      }
    }
  },
  created () {
    this.getAllBillingRequestNetworkCall()
  },
  methods: {
    ...mapActions('bill', ['requestGetAllBillingRequest', 'requestBillingStatusChange']),
    async getAllBillingRequestNetworkCall () {
      this.loading = true
      await this.requestGetAllBillingRequest({
        $apollo: this.$apollo,
        status: this.billingStatus,
        offset: this.options.page - 1,
        limit: this.options.itemsPerPage !== -1 ? this.options.itemsPerPage : null,
        jwt: this.jwt
      })
      this.loading = false
    },
    getFullName (owner) {
      return owner.firstName + ' ' + owner.lastName
    },
    async acceptBilling (item) {
      console.log('accept billing--->>', item)
      const packageName = item.packageId ? item.packageId.packageName : 'No Data'
      const packagePrice = item.packageId ? item.packageId.packagePrice : 'No Data'
      const billingAmount = item.billingAmount
      const value = await this.$confirm('Are you sure, do you really want to accept the billing request?<br><br>Package Name: ' + packageName + '<br>Package Price: ' + packagePrice + '<br>Billing Amount: ' + billingAmount)

      if (value) {
        this.loading = true
        const res = await this.requestBillingStatusChange({
          $apollo: this.$apollo,
          status: BILLING_STATUS.SUCCESS,
          ownedPackageId: item.OwnedPackageId._id,
          billingId: item.id,
          jwt: this.jwt
        })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
      }
    },
    async rejectBilling (item) {
      const packageName = item.packageId ? item.packageId.packageName : 'No Data'
      const packagePrice = item.packageId ? item.packageId.packagePrice : 'No Data'
      const billingAmount = item.billingAmount
      const value = await this.$confirm('<div class="">Are you sure, do you really want to reject the billing request?<br><br>Package Name: ' + packageName + '<br>Package Price: ' + packagePrice + '<br>Billing Amount: ' + billingAmount + '</div>')

      if (value) {
        this.loading = true
        const res = await this.requestBillingStatusChange({
          $apollo: this.$apollo,
          status: BILLING_STATUS.REJECTED,
          ownedPackageId: item.packageId,
          jwt: this.jwt
        })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
      }
    }
  }
}
</script>
