<template>
  <div>
    <v-card flat tile elevation="10" class="grey lighten-4 my-5">
      <v-card-title>
        Category List
        <v-spacer />
        <v-btn class="primary" rounded small @click="$nuxt.$emit(toggleAddServiceCategoryDialog)">
          <v-icon small>
            mdi-plus
          </v-icon>
          Add Category
        </v-btn>
      </v-card-title>
      <v-divider />
      <div class="pa-8">
        <v-data-table
          :headers="headers"
          :items="allServiceCategory.Category"
          :loading="loading"
          class="grey lighten-4"
        >
          <template #[`item.status`]="{ item }">
            <v-chip
              color="green"
              dark
              small
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn class="ma-1" small outlined color="info" @click="$nuxt.$emit(toggleEditServiceCategoryDialog, item)">
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
        </v-data-table>
      </div>
    </v-card>
    <DialogAddCategory />
    <DialogEditCategory />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'
import { DIALOG_EVENT } from '~/utils/events'
import DialogAddCategory from '~/components/dialogs/DialogAddCategory'
import DialogEditCategory from '~/components/dialogs/DialogEditCategory'

export default {
  name: 'ServiceCategoryPage',
  components: { DialogEditCategory, DialogAddCategory },
  mixins: [DateConverterMixin],
  data () {
    return {
      loading: false,
      imgBaseUrl: process.env.IMAGE_BASE_URL,
      toggleAddServiceCategoryDialog: DIALOG_EVENT.TOGGLE_ADD_SERVICE_CATEGORY,
      toggleEditServiceCategoryDialog: DIALOG_EVENT.TOGGLE_EDIT_SERVICE_CATEGORY,
      filterInput: {
        searchParams: '',
        status: 'Active'
      },
      offset: 0,
      limit: 10,
      headers: [
        {
          text: 'Category Name  ',
          value: 'Category'
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
    ...mapGetters('serviceCategory', ['allServiceCategory']),
    ...mapGetters('auth', ['jwt'])
  },
  async created () {
    await this.getAllCategoryNetworkCall()
  },
  methods: {
    ...mapActions('serviceCategory', ['requestGetAllActiveServiceCategory', 'requestDeleteServiceCategory']),
    async deleteCategory (item) {
      const value = await this.$confirm('Are you sure, do you really want to delete the service category?<br><br>Category Name: ' + item.Category)

      if (value) {
        this.loading = true
        const res = await this.requestDeleteServiceCategory({ $apollo: this.$apollo, ServiceCategoryId: item.id, jwt: this.jwt })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
      }
    },
    async getAllCategoryNetworkCall () {
      this.loading = true
      await this.requestGetAllActiveServiceCategory({
        $apollo: this.$apollo,
        jwt: this.jwt
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>
