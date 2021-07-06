<template>
  <div>
    <v-card flat tile elevation="10" class="grey lighten-4 my-5">
      <v-card-title>
        Order With List
        <v-spacer />
        <v-btn class="primary" rounded small @click="$nuxt.$emit(toggleAddOrderWithDialog)">
          <v-icon small>
            mdi-plus
          </v-icon>
          Add Order With
        </v-btn>
      </v-card-title>
      <v-divider />
      <div class="pa-8">
        <v-data-table
          :headers="headers"
          :items="allOrderWith.OrderWiths"
          :loading="loading"
          :options.sync="options"
          :server-items-length="allOrderWith.count"
          class="grey lighten-4"
        >
          <template #[`item.logo`]="{ item }">
            <v-avatar class="my-2" rounded>
              <img
                v-if="item.logo !== null"
                :src="imgBaseUrl + item.logo"
                :alt="item.name"
              >
              <v-icon v-else>
                mdi-account
              </v-icon>
            </v-avatar>
          </template>
          <template #[`item.textColour`]="{ item }">
            <v-chip
              :color="item.textColour"
              dark
              small
            />
            <span class="caption">{{ item.textColour }}</span>
          </template>
          <template #[`item.FillColour`]="{ item }">
            <v-chip
              :color="item.FillColour"
              dark
              small
            />
            <span class="caption">{{ item.FillColour }}</span>
          </template>
          <template #[`item.customColour`]="{ item }">
            <span
              class="caption"
            >
              <v-icon small :class="item.customColour ? 'success--text' : 'error--text'">
                {{ item.customColour ? 'mdi-check' : 'mdi-close' }}
              </v-icon>
              {{ item.customColour ? 'Yes': 'No' }}
            </span>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn class="ma-1" small outlined color="info" @click="$nuxt.$emit(toggleEditOrderWithDialog, item)">
              <v-icon small class="mr-1">
                mdi-pencil
              </v-icon>
              Edit
            </v-btn>
            <v-btn class="ma-1" small outlined color="error" @click="deleteOrderWith(item)">
              <v-icon small class="mr-1">
                mdi-delete
              </v-icon>
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card>
    <DialogAddOrderWith />
    <DialogEditOrderWith />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import DateConverterMixin from '~/mixins/DateConverterMixin'
import { API_CALL_EVENT, DIALOG_EVENT } from '~/utils/events'
import DialogAddOrderWith from '~/components/dialogs/DialogAddOrderWith'
import { DEFAULT_STATUS } from '~/utils/apiStatusCode'
import DialogEditOrderWith from '~/components/dialogs/DialogEditOrderWith'

export default {
  name: 'PageOrderWith',
  components: {
    DialogEditOrderWith,
    DialogAddOrderWith
  },
  mixins: [DateConverterMixin],
  data () {
    return {
      loading: false,
      imgBaseUrl: process.env.IMAGE_BASE_URL,
      toggleAddOrderWithDialog: DIALOG_EVENT.TOGGLE_ADD_ORDER_WITH,
      toggleEditOrderWithDialog: DIALOG_EVENT.TOGGLE_EDIT_ORDER_WITH,
      offset: 0,
      limit: 10,
      headers: [
        {
          text: 'Logo',
          value: 'logo'
        },
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Text Colour',
          value: 'textColour'
        },
        {
          text: 'Fill Colour',
          value: 'FillColour'
        },
        {
          text: 'Show Custom Colour',
          value: 'customColour',
          align: 'center'
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
    ...mapGetters('orderWith', ['allOrderWith']),
    ...mapGetters('auth', ['jwt'])
  },
  watch: {
    options: {
      deep: true,
      handler () {
        this.getAllOrderWithNetworkCall()
      }
    }
  },
  async created () {
    await this.getAllOrderWithNetworkCall()
    this.$nuxt.$on(API_CALL_EVENT.GET_ALL_ORDER_WITH_NETWORK_CALL_EVENT, () => {
      this.getAllOrderWithNetworkCall()
    })
  },
  methods: {
    ...mapActions('orderWith', ['requestGetAllOrderWith', 'requestDeleteOrderWith']),
    async deleteOrderWith (item) {
      const value = await this.$confirm('Are you sure, do you really want to delete the order with?<br><br>Name: ' + item.name)

      if (value) {
        this.loading = true

        const res = await this.requestDeleteOrderWith({
          $apollo: this.$apollo,
          OrderWithId: item.id,
          jwt: this.jwt
        })
        this.loading = false
        this.$notifier.showMessage({
          content: res.msg,
          color: res.code
        })
        if (res.code === 'success') {
          await this.getAllOrderWithNetworkCall()
        }
      }
    },
    async getAllOrderWithNetworkCall () {
      this.loading = true
      await this.requestGetAllOrderWith({
        $apollo: this.$apollo,
        status: DEFAULT_STATUS.ACTIVE,
        offset: this.options.page - 1,
        limit: this.options.itemsPerPage !== -1 ? this.options.itemsPerPage : null,
        jwt: this.jwt
      })
      this.loading = false
    }
  }
}
</script>

<style scoped>
</style>
