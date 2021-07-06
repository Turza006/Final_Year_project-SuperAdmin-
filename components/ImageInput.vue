<template>
  <div
    class="base-image-input"
    :style="{ 'background-image': `url(${imageData})` }"
    @click="chooseImage"
  >
    <div v-if="!imageData" class="row ml-2 placeholder">
      <v-img
        v-if="imageLink !== '' && imageLink != null"
        class="base-image-input"
        :src="img"
      />
      <v-img v-else class="base-image-input" src="/img/ic_img_upload.png" />
    </div>
    <input
      ref="imageFile"
      class="file-input"
      type="file"
      @input="onSelectFile"
    >
    <v-progress-linear
      :active="isLoading"
      :indeterminate="isLoading"
      absolute
      top
      color="deep-purple accent-4"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ImageInput',
  props: {
    imageLink: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isLoading: false,
      imageData: null,
      imageUrl: '',
      file: null,
      img: ''
    }
  },
  computed: {
    ...mapGetters('upload', ['singleUploadImageLink'])
  },
  watch: {
    imageLink (newValue) {
      if (newValue !== '') { this.img = process.env.IMAGE_BASE_URL + newValue }
    }
  },
  beforeMount () {
    this.img = this.imageLink
  },
  methods: {
    ...mapActions('upload', ['singleUpload']),
    chooseImage () {
      this.$refs.imageFile.click()
    },
    onSelectFile () {
      // console.log('onSelectFile called')

      const input = this.$refs.imageFile
      const files = input.files

      if (files && files[0]) {
        // console.log('image loaded')
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageData = e.target.result
          this.file = this.$refs.imageFile.files[0]
          this.uploadImageDataNetworkCall()
        }
        reader.readAsDataURL(files[0])
        this.$emit('imageFile', files[0])
      } else {
        console.log('image not loaded')
      }
    },
    async uploadImageDataNetworkCall () {
      try {
        this.isLoading = true
        await this.singleUpload({ $apollo: this.$apollo, file: this.file, jwt: this.$store.state.auth.jwt })
        this.isLoading = false

        if (this.uploadedFileName === '') {
          this.$notifier.showMessage({
            content: 'Could not upload',
            color: 'error'
          })
          // console.log('Could not upload')
        } else {
          // console.log(this.singleUploadImageLink)
          this.$emit('changeImagelink', this.singleUploadImageLink)
          this.$store.commit('upload/UNSET_SINGLE_UPLOAD_IMAGE_LINK')
        }
      } catch (err) {
        console.log(err.message)
      }
    }
  }
}
</script>

<style scoped>
.base-image-input {
  display: block;
  width: 160px;
  height: 160px;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}

.placeholder {
  background: #e2e2e2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 18px;
}

.placeholder:hover {
  background: #6f7479;
}

.file-input {
  display: none;
}
</style>
