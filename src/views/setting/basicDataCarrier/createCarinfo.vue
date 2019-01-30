<template>
  <car-info :is-edit="false" />
</template>

<script>
import CarInfo from './components/CarInfo'

export default {
  name: 'CreateCarinfo',
  components: { CarInfo },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>
