<template>
    <div>
        <h1>{{ titulo }}</h1>
        <input v-model="titulo">
    </div>
</template>

<script>
export default {
  data: function () {
    return {
      titulo: 'Ola vuejs!'
    }
  }
}
</script>
