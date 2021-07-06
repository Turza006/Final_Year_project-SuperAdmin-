<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="400"
  >
    <v-card flat tile class="grey lighten-4" elevation="10">
      <v-card-title class="white--text primary">
        Add Package
      </v-card-title>
      <v-form ref="form" class="pa-10">
        <label>Package Title *</label>
        <v-text-field
          v-model="form.packageName"
          type="text"
          class="mt-2"
          :rules="serviceNameRules"
          placeholder="Package Title"
          filled
          dense
          rounded
        />
        <label>Category *</label>
        <v-select
          v-model="selectedCategoryId"
          :items="allServiceCategory.Category"
          :rules="categoryRules"
          :loading="loading"
          class="mt-2"
          filled
          rounded
          dense
          item-text="Category"
          item-value="id"
          placeholder="Category"
        />
        <label>Services *</label>
        <v-select
          v-model="form.serviceCovered"
          :rules="serviceCoveredRules"
          :items="allService.Services"
          :loading="loadingService"
          class="mt-2"
          filled
          multiple
          chips
          rounded
          dense
          item-text="serviceName"
          item-value="id"
          placeholder="Services"
          hint="Choose the services for package"
          persistent-hint
        />
        <div class="text-center mt-4">
          <v-btn class="primary white--text" rounded :disabled="submitting" :loading="submitting" @click="submitForm()">
            <v-icon class="mr-1">
              mdi-content-save
            </v-icon>
            Add
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { API_CALL_EVENT, DIALOG_EVENT } from '~/utils/events'
import { TOAST } from '~/utils/strings'

export default {
  name: 'DialogAddPackage',
  data () {
    return {
      dialog: false,
      loading: false,
      loadingService: false,
      submitting: false,
      selectedCategoryId: '',
      form: {
        packageName: '',
        serviceCovered: '',
        ServiceCategory: ''
      },
      statusList: ['ACTIVE', 'UNPUBLISHED'],
      serviceNameRules: [
        v => !!v || 'Service name is required',
        v => v.length >= 2 || 'Service name must be at least 2 characters or more'
      ],
      serviceCoveredRules: [
        v => !!v || 'Service is required'
      ],
      categoryRules: [
        v => !!v || 'Category is required'
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['jwt']),
    ...mapGetters('service', ['allService']),
    ...mapGetters('serviceCategory', ['allServiceCategory'])
  },
  watch: {
    selectedCategoryId (newValue) {
      this.form.ServiceCategory = newValue
      this.getAllCategoryNetworkCall(newValue)
    }
  },
  async created () {
    this.loading = true
    await this.requestGetAllActiveServiceCategory({
      $apollo: this.$apollo,
      jwt: this.jwt
    })
    this.loading = false
    this.$nuxt.$on(DIALOG_EVENT.TOGGLE_CREATE_PACKAGE_DIALOG, () => {
      this.dialog = !this.dialog
    })
  },
  methods: {
    ...mapActions('serviceCategory', ['requestGetAllActiveServiceCategory']),
    ...mapActions('service', ['requestGetAllServiceByCategoryId']),
    ...mapActions('package', ['requestCreatePackage']),
    async getAllCategoryNetworkCall (CategoryId) {
      this.loadingService = true
      await this.requestGetAllServiceByCategoryId({
        $apollo: this.$apollo,
        CategoryId,
        jwt: this.jwt
      })
      this.loadingService = false
    },
    async submitForm () {
      if (this.$refs.form.validate()) {
        this.submitting = true
        const res = await this.requestCreatePackage({
          $apollo: this.$apollo,
          payload: this.form,
          jwt: this.$store.state.auth.jwt
        })
        this.submitting = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
        if (res.code === 'success') {
          this.$nuxt.$emit(API_CALL_EVENT.GET_ALL_PACKAGE_NETWORK_CALL_EVENT)
          this.form = {
            packageName: '',
            serviceCovered: [],
            ServiceCategory: ''
          }
          this.dialog = false
        }
      } else {
        this.$notifier.showMessage({
          content: TOAST.INVALID_INPUT,
          color: 'error'
        })
      }
    }
  }
}
</script>
