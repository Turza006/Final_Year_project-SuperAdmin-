<template>
  <div>
    <v-card tile elevation="10" class="my-5 grey lighten-4">
      <v-card-title>
        Profile
        <v-spacer />
        <v-btn
          class="mr-2"
          color="primary"
          outlined
          small
          rounded
          text
          @click="$nuxt.$emit('toggleDialogChangePassword')"
        >
          <v-icon small class="mr-1">
            mdi-key-change
          </v-icon>
          Change Password
        </v-btn>
        <v-btn
          outlined
          small
          color="primary"
          rounded
          text
          to="/profile/edit"
        >
          <v-icon small class="mr-1">
            mdi-pencil
          </v-icon>
          Edit
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-layout>
        <v-flex>
          <div class="pa-10 text-center">
            <v-avatar
              class="profile"
              size="164"
              tile
            >
              <v-icon
                v-if="adminInfo.image === undefined || adminInfo.image === null || adminInfo.image === ''"
                size="164"
              >
                mdi-account
              </v-icon>
              <v-img
                v-else
                :src="imgBaseUrl + adminInfo.image"
                max-width="164px"
                max-height="164px"
                style="border-radius: 50%"
                class="mx-auto"
              />
            </v-avatar>
            <div class="font-weight-bold mb-2">
              <span class="font-weight-lighter title">{{ `${adminInfo.firstName} ${adminInfo.lastName}` }}</span>
            </div>
            <div class="font-weight-bold">
              <span class="font-weight-lighter">{{ adminInfo.email }}</span>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
    <DialogChangePassword />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DialogChangePassword from '~/components/dialogs/DialogChangePassword'

export default {
  name: 'PageAdminProfile',
  components: {
    DialogChangePassword
  },
  data () {
    return {
      imgBaseUrl: process.env.IMAGE_BASE_URL
    }
  },
  computed: {
    ...mapGetters('auth', ['jwt']),
    ...mapGetters('profile', ['adminInfo'])
  },
  async created () {
    await this.requestGetSuperAdminProfileSelf({ $apollo: this.$apollo, jwt: this.jwt })
  },
  methods: {
    ...mapActions('profile', ['requestGetSuperAdminProfileSelf'])
  }
}
</script>

<style scoped>

</style>
