<template>
    <div>
        <label>{{ customLabel }}</label>
        <input 
            type="range"
            :value="valor"
            v-bind="$attrs"
            :class="inputClasses"
            @change="atualizar">
    </div>
</template>

<script>
export default {
    inheritAttrs: false,
    model: {
      prop: 'valor',
      event: 'change'
    },
    props: {
        label: String,
        valor: [Number, String],
        inputClasses: [String, Object, Array]
    },
    computed: {
        customLabel() {
            return `${this.label} (R$ ${this.valor || this.$attrs.min})`
        }
    },
    methods: {
        atualizar() {
            const valor = event.target.value
            this.$emit('change', valor)
        }
    }
}
</script>