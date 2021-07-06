import gql from 'graphql-tag'

export const UPLOAD_IMAGE_MUTATION = gql`
  mutation SingleUpload($file: Upload!) {
    SingleUpload(file: $file) {
      filename
      mimetype
      imageLink
      msg
      code
    }
  }
`
