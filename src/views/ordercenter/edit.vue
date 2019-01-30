<template>
  <add-order :is-edit="true"/>
</template>

<script>
import AddOrder from './components/AddOrder'

export default {
  name: 'EditForm',
  components: { AddOrder }
}
</script>

