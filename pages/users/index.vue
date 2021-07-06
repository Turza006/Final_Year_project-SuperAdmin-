<template>
  <div>
    <v-card flat tile elevation="10" class="grey lighten-4 my-5">
      <v-card-title>
        User List <span class="pl-2 pt-2 caption grey--text">(Service Owners)</span>
      </v-card-title>
      <v-divider />
      <div class="pa-8">
        <v-data-table
          :headers="headers"
          :items="allOwner.Owners"
          :search="search"
          :loading="loading"
          :options.sync="options"
          :server-items-length="allOwner.count"
          class="grey lighten-4"
        >
          <template #[`item.firstName`]="{ item }">
            <div>
              <v-avatar class="my-2">
                <img
                  v-if="item.profilePic !== null"
                  :src="imgBaseUrl + item.profilePic"
                  :alt="item.firstName"
                >
                <v-icon v-else>
                  mdi-account
                </v-icon>
              </v-avatar>
              {{ getFullName(item) }}
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
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'

export default {
  name: 'PageUser',
  mixins: [DateConverterMixin],
  data () {
    return {
      loading: false,
      imgBaseUrl: process.env.IMAGE_BASE_URL,
      selectedStatus: 'Active',
      search: '',
      headers: [
        {
          text: 'Name',
          value: 'firstName'
        },
        {
          text: 'Email',
          value: 'email'
        },
        {
          text: 'Phone',
          value: 'phoneNo'
        },
        {
          text: 'Phone Verified',
          value: 'isPhoneVerified'
        },
        {
          text: 'Created at ',
          value: 'createdAt'
        },
        {
          text: 'Updated at ',
          value: 'updatedAt'
        }
      ],
      options: {
        page: 1,
        itemsPerPage: 10,
        pageCount: 0,
        itemsLength: 0
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['jwt']),
    ...mapGetters('owner', ['allOwner'])
  },
  watch: {
    options: {
      deep: true,
      handler () {
        this.getAllOwnerNetworkCall()
      }
    }
  },
  created () {
    this.getAllOwnerNetworkCall()
  },
  methods: {
    ...mapActions('owner', ['requestGetAllOwner']),
    async getAllOwnerNetworkCall () {
      const filterInput = {
        searchParam: this.search,
        status: this.selectedStatus
      }
      this.loading = true
      await this.requestGetAllOwner({
        $apollo: this.$apollo,
        filterInput,
        offset: this.options.page - 1,
        limit: this.options.itemsPerPage !== -1 ? this.options.itemsPerPage : null,
        jwt: this.jwt
      })
      this.loading = false
    },
    getFullName (owner) {
      return owner.firstName + ' ' + owner.lastName
    }
  }
}
</script>

<style scoped>

</style>
