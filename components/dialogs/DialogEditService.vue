<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="400"
  >
    <v-card flat tile class="grey lighten-4" elevation="10">
      <v-card-title class="white--text primary">
        Edit Service
      </v-card-title>
      <v-form ref="form" class="pa-10">
        <label>Service Name *</label>
        <v-text-field
          v-model="form.serviceName"
          type="text"
          class="mt-2"
          :rules="serviceNameRules"
          placeholder="Service Name"
          filled
          dense
          rounded
        />
        <label>Price *</label>
        <v-text-field
          v-model="form.servicePrice"
          type="text"
          class="mt-2"
          :rules="servicePriceRules"
          placeholder="Service Price"
          filled
          dense
          rounded
        />
        <label>Category *</label>
        <v-select
          v-model="form.ServiceCategory"
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
        <div class="text-center">
          <v-btn class="primary white--text" rounded :disabled="submitting" :loading="submitting" @click="submitForm()">
            <v-icon class="mr-1">
              mdi-content-save
            </v-icon>
            Update
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
  name: 'DialogEditService',
  data () {
    return {
      dialog: false,
      loading: false,
      submitting: false,
      serviceId: '',
      form: {
        serviceName: '',
        servicePrice: '',
        ServiceCategory: ''
      },
      statusList: ['ACTIVE', 'UNPUBLISHED'],
      serviceNameRules: [
        v => !!v || 'Service name is required',
        v => v.length >= 2 || 'Service name must be at least 2 characters or more'
      ],
      servicePriceRules: [
        v => !!v || 'Price is required',
        v => v >= 0 || 'Price is not valid'
      ],
      categoryRules: [
        v => !!v || 'Category is required'
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['jwt']),
    ...mapGetters('serviceCategory', ['allServiceCategory'])
  },
  async created () {
    await this.getAllCategoryNetworkCall()
    this.$nuxt.$on(DIALOG_EVENT.TOGGLE_EDIT_SERVICE_DIALOG, (service) => {
      this.serviceId = service.id
      this.form.serviceName = service.serviceName
      this.form.servicePrice = service.servicePrice
      this.form.ServiceCategory = service.ServiceCategory.id
      this.dialog = !this.dialog
    })
  },
  methods: {
    ...mapActions('serviceCategory', ['requestGetAllActiveServiceCategory']),
    ...mapActions('service', ['requestEditService']),
    async getAllCategoryNetworkCall () {
      this.loading = true
      await this.requestGetAllActiveServiceCategory({
        $apollo: this.$apollo,
        jwt: this.jwt
      })
      this.loading = false
    },
    async submitForm () {
      if (this.$refs.form.validate()) {
        this.form.servicePrice = parseFloat(this.form.servicePrice)
        this.submitting = true
        const res = await this.requestEditService({
          $apollo: this.$apollo,
          payload: this.form,
          ServiceId: this.serviceId,
          jwt: this.$store.state.auth.jwt
        })
        this.submitting = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
        if (res.code === 'success') {
          this.$nuxt.$emit(API_CALL_EVENT.GET_ALL_SERVICE_NETWORK_CALL_EVENT)
          this.form = {
            serviceName: '',
            servicePrice: '',
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
