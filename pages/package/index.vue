<template>
  <div>
    <v-card flat tile elevation="10" class="grey lighten-4 my-5">
      <v-card-title>
        <v-row class="pa-0 ma-0">
          <v-col>
            Package List
          </v-col>
          <v-col v-if="selectedCategory !== ''" class="pa-0" cols="2">
            <v-select
              v-model="selectedStatus"
              :items="statusList"
              filled
              rounded
              dense
              solo
              hint="Filter by Status"
              persistent-hint
            />
          </v-col>
          <v-col cols="4" class="py-0">
            <v-select
              v-model="selectedCategory"
              :items="categoryList"
              :loading="categoryLoading"
              filled
              rounded
              dense
              solo
              item-text="Category"
              item-value="id"
              hint="Filter by Category"
              persistent-hint
            />
          </v-col>
          <v-btn small class="primary mt-2" rounded @click="$nuxt.$emit(toggleCreatePackageDialog)">
            <v-icon small>
              mdi-plus
            </v-icon>
            Add Package
          </v-btn>
        </v-row>
      </v-card-title>
      <v-divider />
      <div class="pa-8">
        <v-data-table
          :headers="headers"
          :items="allPackage"
          :loading="loading"
          class="grey lighten-4"
        >
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
          <template #[`item.status`]="{ item }">
            <v-chip
              :color=" item.status === 'ACTIVE' ? 'green' : 'error'"
              dark
              small
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn class="ma-1" small outlined color="info" @click="$nuxt.$emit(toggleEditPackageDialog, item)">
              <v-icon small class="mr-1">
                mdi-pencil
              </v-icon>
              Edit
            </v-btn>
            <v-btn class="ma-1" small outlined color="error" @click="deletePackage(item)">
              <v-icon small class="mr-1">
                mdi-delete
              </v-icon>
              Delete
            </v-btn>
            <v-btn class="ma-1" small outlined color="success" @click="$nuxt.$emit(toggleShowPackageDetailsDialog, item)">
              <v-icon small class="mr-1">
                mdi-eye
              </v-icon>
              Details
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card>
    <DialogAddPackage />
    <DialogEditPackage />
    <DialogShowPackageDetails />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'
import { API_CALL_EVENT, DIALOG_EVENT } from '~/utils/events'
import DialogAddPackage from '~/components/dialogs/DialogAddPackage'
import DialogEditPackage from '~/components/dialogs/DialogEditPackage'
import DialogShowPackageDetails from '~/components/dialogs/DialogShowPackageDetails'

export default {
  name: 'PackagePage',
  components: { DialogShowPackageDetails, DialogEditPackage, DialogAddPackage },
  mixins: [DateConverterMixin],
  data () {
    return {
      loading: false,
      categoryLoading: false,
      selectedCategory: '',
      selectedStatus: 'ACTIVE',
      statusList: ['ACTIVE', 'DELETED'],
      categoryList: [],
      imgBaseUrl: process.env.IMAGE_BASE_URL,
      toggleCreatePackageDialog: DIALOG_EVENT.TOGGLE_CREATE_PACKAGE_DIALOG,
      toggleEditPackageDialog: DIALOG_EVENT.TOGGLE_EDIT_PACKAGE_DIALOG,
      toggleShowPackageDetailsDialog: DIALOG_EVENT.TOGGLE_SHOW_PACKAGE_DETAILS_DIALOG,
      filterInput: {
        searchParams: '',
        status: 'Active'
      },
      offset: 0,
      limit: 10,
      headers: [
        {
          text: 'Package Name  ',
          value: 'packageName'
        },
        {
          text: 'Service Category  ',
          value: 'ServiceCategory.Category'
        },
        {
          text: 'Price  ',
          value: 'packagePrice'
        },
        {
          text: 'Created At ',
          value: 'createdAt'
        },
        {
          text: 'Updated At',
          value: 'updatedAt'
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
    ...mapGetters('package', ['allPackage']),
    ...mapGetters('serviceCategory', ['allServiceCategory'])
  },
  watch: {
    async selectedStatus () {
      await this.getAllPackageNetworkCall()
    },
    async selectedCategory () {
      await this.getAllPackageNetworkCall()
    }
    /* options: {
      deep: true,
      handler () {
        this.getAllPackageNetworkCall()
      }
    },
    filterInput: {
      deep: true,
      async handler () {
        await this.getAllPackageNetworkCall()
      }
    } */
  },
  async created () {
    this.$nuxt.$on(API_CALL_EVENT.GET_ALL_PACKAGE_NETWORK_CALL_EVENT, async () => {
      await this.getAllPackageNetworkCall()
    })

    this.categoryLoading = true
    this.loading = true
    await this.getAllPackageNetworkCall()
    this.loading = false
    await this.requestGetAllActiveServiceCategory({ $apollo: this.$apollo, jwt: this.jwt })
    this.categoryList.push({ id: '', Category: 'All' })
    this.categoryList.push(...this.allServiceCategory.Category)
    this.categoryLoading = false
  },
  methods: {
    ...mapActions('serviceCategory', ['requestGetAllActiveServiceCategory']),
    ...mapActions('package', ['requestGetAllPackage', 'requestGetAllPackageByCategoryId', 'requestDeletePackage']),
    async deletePackage (item) {
      const value = await this.$confirm('Are you sure, do you really want to delete the package?<br><br>Package Name: ' + item.packageName)

      if (value) {
        this.loading = true
        const res = await this.requestDeletePackage({ $apollo: this.$apollo, packageId: item.id, jwt: this.jwt })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
      }
    },
    async getAllPackageNetworkCall () {
      this.loading = true
      if (this.selectedCategory === '') {
        await this.requestGetAllPackage({
          $apollo: this.$apollo,
          jwt: this.jwt
        })
      } else {
        await this.requestGetAllPackageByCategoryId({
          $apollo: this.$apollo,
          CategoryId: this.selectedCategory,
          status: this.selectedStatus,
          jwt: this.jwt
        })
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>
