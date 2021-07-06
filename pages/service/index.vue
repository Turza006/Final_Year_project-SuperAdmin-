<template>
  <div>
    <v-card flat tile elevation="10" class="grey lighten-4 my-5">
      <v-card-title>
        <v-row class="pa-0 ma-0">
          <v-col>
            Service List
          </v-col>
          <v-spacer />
          <v-col cols="4" class="py-0">
            <v-select
              v-model="selectedCategory"
              :items="categoryList"
              :loading="categoryLoading"
              filled
              solo
              rounded
              dense
              item-text="Category"
              item-value="id"
              hint="Filter by Category"
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
      <v-divider />
      <div class="pa-8">
        <v-data-table
          :headers="headers"
          :items="allService.Services"
          :loading="loading"
          class="grey lighten-4"
        >
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
            <v-btn class="ma-1" small outlined color="info" @click="$nuxt.$emit(toggleEditServiceDialog, item)">
              <v-icon small class="mr-1">
                mdi-pencil
              </v-icon>
              Edit
            </v-btn>
            <v-btn class="ma-1" small outlined color="error" @click="deleteCategory(item)">
              <v-icon small class="mr-1">
                mdi-delete
              </v-icon>
              Delete
            </v-btn>
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
    <DialogAddService />
    <DialogEditService />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'
import { API_CALL_EVENT, DIALOG_EVENT } from '~/utils/events'
import DialogAddService from '~/components/dialogs/DialogAddService'
import DialogEditService from '~/components/dialogs/DialogEditService'

export default {
  name: 'ServicePage',
  components: {
    DialogEditService,
    DialogAddService
  },
  mixins: [DateConverterMixin],
  data () {
    return {
      loading: false,
      categoryLoading: false,
      selectedCategory: '',
      categoryList: [],
      imgBaseUrl: process.env.IMAGE_BASE_URL,
      toggleAddServiceDialog: DIALOG_EVENT.TOGGLE_ADD_SERVICE_DIALOG,
      toggleEditServiceDialog: DIALOG_EVENT.TOGGLE_EDIT_SERVICE_DIALOG,
      filterInput: {
        searchParams: '',
        status: 'Active'
      },
      offset: 0,
      limit: 10,
      headers: [
        {
          text: 'Service Name',
          value: 'serviceName'
        },
        {
          text: 'Price',
          value: 'servicePrice'
        },
        {
          text: 'Category',
          value: 'ServiceCategory.Category'
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
    ...mapGetters('service', ['allService']),
    ...mapGetters('serviceCategory', ['allServiceCategory'])
  },
  watch: {
    async selectedCategory () {
      await this.getAllServiceNetworkCall()
    }
  },
  async created () {
    this.$nuxt.$on(API_CALL_EVENT.GET_ALL_SERVICE_NETWORK_CALL_EVENT, async () => {
      await this.getAllServiceNetworkCall()
    })

    this.loading = true
    this.categoryLoading = true
    await this.getAllServiceNetworkCall()
    this.loading = false
    await this.requestGetAllActiveServiceCategory({ $apollo: this.$apollo, jwt: this.jwt })
    this.categoryList.push({ id: '', Category: 'All' })
    this.categoryList.push(...this.allServiceCategory.Category)
    this.categoryLoading = false
  },
  methods: {
    ...mapActions('serviceCategory', ['requestGetAllActiveServiceCategory']),
    ...mapActions('service', ['requestGetAllService', 'requestGetAllServiceByCategoryId', 'requestDeleteService']),
    async deleteCategory (item) {
      const value = await this.$confirm('Are you sure, do you really want to delete the service?<br><br>Service Name: ' + item.serviceName)

      if (value) {
        this.loading = true
        const res = await this.requestDeleteService({
          $apollo: this.$apollo,
          ServiceId: item.id,
          jwt: this.jwt
        })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
      }
    },
    async getAllServiceNetworkCall () {
      this.loading = true
      if (this.selectedCategory === '') {
        await this.requestGetAllService({
          $apollo: this.$apollo,
          jwt: this.jwt
        })
      } else {
        await this.requestGetAllServiceByCategoryId({
          $apollo: this.$apollo,
          CategoryId: this.selectedCategory,
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
