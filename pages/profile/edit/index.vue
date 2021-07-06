<template>
  <div>
    <v-card class="my-5 grey lighten-4" flat tile elevation="10" :loading="loading">
      <v-card-title class="">
        Edit Profile
      </v-card-title>
      <v-divider />
      <v-form ref="form">
        <!--        <v-layout>
                  <v-flex
                    class="mt-5"
                  >
                    <ImageInput
                      class="mx-auto"
                      :image-link="form.image"
                      @changeImagelink="updateImageUrl($event)"
                    />
                  </v-flex>
                </v-layout>-->
        <div class="pa-10">
          <h3 class="text-uppercase mb-5">
            Account Information
          </h3>
          <v-layout>
            <v-flex xs12 md2 sm4 class="pt-4">
              <label>Edit First Name:</label>
            </v-flex>
            <v-flex xs12 md10 sm8>
              <v-text-field
                v-model="form.firstName"
                :rules="firstNameRules"
                type="text"
                label="First Name"
                placeholder="First Name*"
                prepend-inner-icon="mdi-account"
                append-icon="mdi-pencil"
                solo
                rounded
              />
            </v-flex>
            <v-flex />
          </v-layout>
          <v-layout>
            <v-flex xs12 md2 sm4 class="mt-4">
              <label>Edit Last Name:</label>
            </v-flex>
            <v-flex xs12 md10 sm8>
              <v-text-field
                v-model="form.lastName"
                :rules="lastNameRules"
                type="text"
                label="Last Name"
                placeholder="Last Name"
                prepend-inner-icon="mdi-account"
                append-icon="mdi-pencil"
                solo
                rounded
              />
            </v-flex>
          </v-layout>
          <!--          <v-layout>
            <v-flex xs12 md2 sm4 class="mt-4">
              <label>Email:</label>
            </v-flex>
            <v-flex xs12 md10 sm8>
              <v-text-field
                v-model="form.email"
                :rules="emailRules"
                type="email"
                label="Email*"
                placeholder="Email*"
                prepend-inner-icon="mdi-gmail"
                append-icon="mdi-pencil"
                solo
                rounded
                disabled
              />
            </v-flex>
          </v-layout>-->
          <!-- <v-layout>
            <v-flex xs12 md2 sm4 class="mt-4">
              <label>Edit Phone Number:</label>
            </v-flex>
            <v-flex xs12 md10 sm8 class="mt-4">
              <vue-phone-number-input
                v-model="form.phoneNo"
                :no-validator-state="false"
                default-country-code="CA"
                :only-countries="['CA']"
              />
            </v-flex>
          </v-layout>-->
        </div>
      </v-form>
      <div class="pb-8 text-center pb-10">
        <v-btn class="primary mx-auto white--text" rounded :loading="submittingForm" @click="onSubmit()">
          <v-icon class="mr-1">
            mdi-update
          </v-icon>
          Update Profile
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import 'vue-phone-number-input/dist/vue-phone-number-input.css'
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'

export default {
  name: 'EditAdminProfile',
  mixins: [DateConverterMixin],
  data () {
    return {
      loading: false,
      submittingForm: false,
      adminId: '',
      form: {
        firstName: '',
        lastName: ''
        // phoneNo: '',
        // email: '',
        // dob: '',
        // image: ''
      },
      firstNameRules: [
        v => !!v || 'First Name is required',
        v => v.length >= 3 || 'First Name must be at least 3 characters or more.'
      ],
      lastNameRules: [
        v => !!v || 'Last name is required',
        v => v.length >= 2 || 'The last name must be at least 2 characters or more.'
      ]
      /* emailRules: [
        v => !!v || 'E-mail is required',
        v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid'
      ] */
    }
  },
  computed: {
    ...mapGetters('auth', ['jwt']),
    ...mapGetters('profile', ['adminInfo'])
  },
  async created () {
    this.loading = true
    await this.requestGetSuperAdminProfileSelf({
      $apollo: this.$apollo,
      jwt: this.jwt
    })
    this.loading = false

    this.form = {
      firstName: this.adminInfo.firstName,
      lastName: this.adminInfo.lastName
    }
    this.adminId = this.adminInfo.id
  },
  methods: {
    ...mapActions('auth', ['requestEditAdminProfile']),
    ...mapActions('profile', ['requestGetSuperAdminProfileSelf', 'requestEditSuperAdminProfile']),
    updateImageUrl (url) {
      this.form.image = url
    },
    async onSubmit () {
      if (this.$refs.form.validate()) {
        // console.log('input valid :)', this.form)
        this.submittingForm = true
        const res = await this.requestEditSuperAdminProfile({
          $apollo: this.$apollo,
          payload: this.form,
          jwt: this.jwt
        })
        this.submittingForm = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })

        if (res.code === 'success') {
          await this.$router.push('/profile')
        }
      } else {
        this.$notifier.showMessage({
          content: 'Please enter valid input',
          color: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
