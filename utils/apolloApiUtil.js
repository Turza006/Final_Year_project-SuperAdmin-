export const getMutationData = async function ($apollo, query, args) {
  const { data } = await $apollo.mutate({
    mutation: query,
    variables: args
  })
  // console.log(data)
  return data
}

export const getData = async function ($apollo, query, args) {
  const { data } = await $apollo.query({
    query,
    variables: args,
    fetchPolicy: 'network-only'
  })
  // console.log(data)
  return data
}

export const getDataWithCustomHeader = async function ($apollo, query, args, header) {
  const { data } = await $apollo.query({
    query,
    variables: args,
    context: {
      headers: {
        Authorization: `Bearer ${header.jwt}`
      }
    },
    fetchPolicy: 'network-only'
  })
  // console.log(data)
  return data
}

export const getMutationDataWithCustomHeader = async function (
  $apollo,
  query,
  args,
  header
) {
  const { data } = await $apollo.mutate({
    mutation: query,
    variables: args,
    context: {
      headers: {
        Authorization: `Bearer ${header.jwt}`
      }
    }
  })

  // console.log(data);

  return data
}
