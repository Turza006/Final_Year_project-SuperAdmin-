<template>
  <v-simple-table>
    <template #default>
      <thead>
        <tr>
          <th v-for="(header, index) in tableHeader" :key="index" class="text-left subtitle-2">
            {{ Object.keys(header)[0] }}
          </th>
        </tr>
      </thead>
      <tbody v-if="tableBody.length > 0">
        <tr
          v-for="(content, index) in tableBody"
          :key="index"
        >
          <td v-for="(body, i) in tableHeader" :key="i">
            {{ content[body[Object.keys(body)[0]]] }}
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="2" class="text-center grey lighten-3">
            No Data
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'SimpleTableComponent',
  props: {
    tableHeader: {
      type: Array,
      required: true
    },
    tableBody: {
      type: Array,
      required: true
    }
  }
}
</script>
