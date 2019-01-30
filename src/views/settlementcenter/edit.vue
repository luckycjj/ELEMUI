<template>
  <account-statement :is-edit="true" />
</template>

<script>
import AccountStatement from './components/AccountStatement'

export default {
  name: 'CreateForm',
  components: { AccountStatement },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
