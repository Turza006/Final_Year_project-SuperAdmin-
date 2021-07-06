<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    max-width="600"
  >
    <v-card :loading="loading" flat tile class="grey lighten-4" elevation="10">
      <v-card-title class="white--text primary">
        Add Order With
      </v-card-title>
      <v-form ref="form" class="pa-10">
        <label class="ml-3">Image *</label>
        <ImageInput class="my-4" @changeImagelink="updateImageUrl($event)"/>
        <label>Name *</label>
        <v-text-field
          v-model="form.name"
          type="text"
          class="mt-2"
          :rules="nameRules"
          placeholder="Category Name"
          filled
          dense
          rounded
        />

        <label>Text Colour *</label>
        <v-text-field
          v-model="form.textColour"
          type="text"
          class="mt-2"
          :rules="textColourRules"
          placeholder="Text Colour"
          hint="ex: #FFFFFF"
          persistent-hint
          filled
          dense
          rounded
        />

        <label>Fill Colour *</label>
        <v-text-field
          v-model="form.FillColour"
          type="text"
          class="mt-2"
          :rules="fillColourRules"
          placeholder="Fill Colour"
          hint="ex: #00CDBC"
          persistent-hint
          filled
          dense
          rounded
        />

        <v-checkbox
          v-model="form.customColour"
          type="text"
          class="mt-2"
          label="Use Custom Colour"
          filled
          dense
          rounded
        />

        <div class="text-center">
          <v-btn :loading="loading" :disabled="loading" class="primary white--text" rounded @click="submitForm()">
            <v-icon class="mr-1">
              mdi-content-save
            </v-icon>
            Add Order With
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { API_CALL_EVENT, DIALOG_EVENT } from '~/utils/events'
import ImageInput from '~/components/ImageInput'
import { TOAST } from '~/utils/strings'

export default {
  name: 'DialogAddOrderWith',
  components: { ImageInput },
  data () {
    return {
      dialog: false,
      loading: false,
      form: {
        name: '',
        logo: '',
        textColour: '',
        FillColour: '',
        customColour: true
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 2 || 'Name must be at least 2 characters or more.'
      ],
      textColourRules: [
        v => !!v || 'Text Colour is required',
        v => /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(v) || 'The color should be a valid hexadecimal color.'
      ],
      fillColourRules: [
        v => !!v || 'Fill Colour is required',
        v => /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(v) || 'The color should be a valid hexadecimal color.'
      ]
    }
  },
  created () {
    this.$nuxt.$on(DIALOG_EVENT.TOGGLE_ADD_ORDER_WITH, () => {
      this.dialog = !this.dialog
    })
  },
  methods: {
    ...mapActions('orderWith', ['requestAddOrderWith']),
    updateImageUrl (url) {
      console.log(url)
      this.form.logo = url
    },
    async submitForm () {
      if (this.form.logo === '') {
        this.$notifier.showMessage({
          content: TOAST.LOGO_IS_REQUIRED,
          color: 'error'
        })
        return
      }
      if (this.$refs.form.validate()) {
        this.loading = true
        const res = await this.requestAddOrderWith({
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
          this.$nuxt.$emit(API_CALL_EVENT.GET_ALL_ORDER_WITH_NETWORK_CALL_EVENT)
          this.form = {
            name: '',
            logo: '',
            textColour: '',
            FillColour: '',
            customColour: false
          }
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
