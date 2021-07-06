<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="400"
  >
    <v-card :loading="loading" flat tile class="grey lighten-4" elevation="10">
      <v-card-title class="white--text primary">
        Add Category
      </v-card-title>
      <v-form ref="form" class="pa-10">
        <label>Category Name *</label>
        <v-text-field
          v-model="form.Category"
          type="text"
          class="mt-2"
          :rules="categoryRules"
          placeholder="Category Name"
          filled
          dense
          rounded
        />
        <label>Status *</label>
        <v-select
          v-model="form.status"
          :items="statusList"
          :rules="statusRules"
          class="mt-2"
          filled
          rounded
          dense
          placeholder="Status"
        />
        <div class="text-center">
          <v-btn :loading="loading" :disabled="loading" class="primary white--text" rounded @click="submitForm()">
            <v-icon class="mr-1">
              mdi-content-save
            </v-icon>
            Add Category
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { DIALOG_EVENT } from '~/utils/events'

export default {
  name: 'DialogAddCategory',
  data () {
    return {
      dialog: false,
      loading: false,
      form: {
        Category: '',
        status: ''
      },
      statusList: ['ACTIVE', 'UNPUBLISHED'],
      categoryRules: [
        v => !!v || 'Category is required',
        v => v.length >= 2 || 'Category must be at least 2 characters or more.'
      ],
      statusRules: [
        v => !!v || 'Status is required'
      ]
    }
  },
  created () {
    this.$nuxt.$on(DIALOG_EVENT.TOGGLE_ADD_SERVICE_CATEGORY, () => {
      this.dialog = !this.dialog
    })
  },
  methods: {
    ...mapActions('serviceCategory', ['requestCreateCategory']),
    async submitForm () {
      if (this.$refs.form.validate()) {
        this.loading = true
        const res = await this.requestCreateCategory({
          $apollo: this.$apollo,
          payload: this.form,
          jwt: this.$store.state.auth.jwt
        })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
        if (res.code === 'success') {
          this.dialog = false
        }
      } else {
        this.$notifier.showMessage({
          content: 'Invalid input',
          color: 'error'
        })
      }
    }
  }
}
</script>
