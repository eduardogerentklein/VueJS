<template>
    <div v-if="contato">
        <h3 class="font-weight-light">Nome: {{ contato.nome }}</h3>
        <p>Email: {{ contato.email }}</p>
        <button 
        class="btn btn-secondary mr-2" 
        @click="$router.back()">
            Voltar
        </button>
        <router-link 
        :to="`/contatos/${id}/editar`"
        class="btn btn-primary">
            Editar
        </router-link>
    </div>
</template>

<script>
import EventBus from '@/event-bus.js'

export default {
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            contato: undefined
        }
    },
    // created() {
    //     this.contato = EventBus.buscarContato(this.id)
    // },
    beforeRouteEnter(to, from, next) {
        next(viewModel => {
            viewModel.contato = EventBus.buscarContato(viewModel.id)
        })
    },
    beforeRouteUpdate(to, from, next) {
        this.contato = EventBus.buscarContato(this.id)
        next()
    }
}
</script>