<template>
  <div>
    <v-card flat tile elevation="10" class="grey lighten-4 my-5">
      <v-card-title>
        Admin List
      </v-card-title>
      <v-divider />
      <div class="pa-8">
        <v-data-table
          :headers="headers"
          :items="allSuperAdmin"
          :search="search"
          :loading="loading"
          class="grey lighten-4"
        >
          <template #[`item.firstName`]="{ item }">
            {{ getFullName(item) }}
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
          <template #[`item.status`]="{ item }">
            <v-chip
              :color="item.status === 'ACTIVE' ? 'success' : 'error'"
              small
              dark
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              v-if="item.status === 'ACTIVE'"
              outlined
              rounded
              x-small
              color="error"
              @click="banAdmin(item)"
            >
              <v-icon small>
                mdi-stop
              </v-icon>
              BLOCK
            </v-btn>
            <v-btn
              v-else
              outlined
              rounded
              x-small
              color="success"
              @click="unbanAdmin(item)"
            >
              <v-icon small>
                mdi-play
              </v-icon>
              ACTIVE
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'
import { SUPER_ADMIN_STATUS } from '~/utils/apiStatusCode'

export default {
  name: 'PageManageAdmin',
  mixins: [DateConverterMixin],
  data () {
    return {
      loading: false,
      imgBaseUrl: process.env.IMAGE_BASE_URL,
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
          text: 'Created at ',
          value: 'createdAt'
        },
        {
          text: 'Status',
          value: 'status'
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
    ...mapGetters('superAdmin', ['allSuperAdmin'])
  },
  created () {
    this.getAllAdminNetworkCall()
  },
  methods: {
    ...mapActions('superAdmin', ['requestGetAllSuperAdmin', 'requestSuperAdminStatusChange']),
    async getAllAdminNetworkCall () {
      this.loading = true
      await this.requestGetAllSuperAdmin({
        $apollo: this.$apollo,
        jwt: this.jwt
      })
      this.loading = false
    },
    getFullName (admin) {
      return admin.firstName + ' ' + admin.lastName
    },
    async banAdmin (admin) {
      const value = await this.$confirm('Are you sure, do you really want to BAN this admin?<br><br>Admin Name: ' + this.getFullName(admin))

      if (value) {
        this.loading = true
        const res = await this.requestSuperAdminStatusChange({
          $apollo: this.$apollo,
          status: SUPER_ADMIN_STATUS.BLOCK,
          id: admin.id,
          jwt: this.jwt
        })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
      }
    },
    async unbanAdmin (admin) {
      const value = await this.$confirm('Are you sure, would you really ACTIVATE this admin?<br><br>Admin Name: ' + this.getFullName(admin))

      if (value) {
        this.loading = true
        const res = await this.requestSuperAdminStatusChange({
          $apollo: this.$apollo,
          status: SUPER_ADMIN_STATUS.ACTIVE,
          id: admin.id,
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

<style scoped>

</style>
