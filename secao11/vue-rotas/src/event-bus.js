import Vue from 'vue'

export default new Vue({
    data: {
        autenticado: false,
        contatos: [
            { id: 1, nome: 'Isaac Newton', email: 'isaac@email.com' },
            { id: 2, nome: 'Albert Einstein', email: 'einstein@email.com' },
            { id: 3, nome: 'Stephen Hawking', email: 'stephen@email.com' }
        ]
    },
    created() {
        this.$on('autenticar', (autenticado) => {
            this.autenticado = autenticado
        })
    },
    methods: {
        buscarContato(id) {
            return Object.assign({}, this.contatos.find(contato => contato.id === id))
        },
        editarContato(contato) {
            const index = this.contatos.findIndex(contact => contact.id === contato.id)
            index != -1 && this.contatos.splice(index, 1, contato)
        }
    }
})