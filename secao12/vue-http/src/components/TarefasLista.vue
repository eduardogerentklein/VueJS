<template>
    <div>

        <div class="row">
            <div class="col-sm-10">
                <h1 class="font-weight-light">Lista de Tarefas</h1>
            </div>
            <div class="col-sm-2">
                <button 
                    class="btn btn-primary float-right"
                    @click="exibirFormularioCriarTarefa">
                    <i class="fa fa-plus mr-2"></i>
                    <span>Criar</span>
                </button>
            </div>
        </div>

        <ul class="list-group" v-if="tarefasOrdenadas.length > 0">
            <TarefasListaIten
                v-for="tarefa in tarefasOrdenadas"
                :key="tarefa.id"
                :tarefa="tarefa"
                @editar="selecionarTarefaParaEdicao"
                @deletar="deletarTarefa" 
                @concluir="editarTarefa"/>
        </ul>

        <p v-else-if="!mensagemErro">Nenhuma tarefa criada.</p>

        <div class="alert alert-danger" v-else>{{ mensagemErro }}</div>

        <TarefaSalvar
            v-if="exibirFormulario"
            :tarefa="tarefaSelecionada"
            @criar="criarTarefa"
            @editar="editarTarefa" />

    </div>
</template>

<script>

import axios from './../axios'

import TarefaSalvar from './TarefaSalvar.vue'
import TarefasListaIten from './TarefasListaIten.vue'

export default {
    components: {
        TarefaSalvar,
        TarefasListaIten
    },
    data() {
        return {
            tarefas: [],
            exibirFormulario: false,
            tarefaSelecionada: undefined,
            mensagemErro: undefined
        }
    },
    computed: {
        tarefasOrdenadas() {
            return this.tarefas.slice().sort((tarefa1, tarefa2) => {
                if (tarefa1.concluido === tarefa2.concluido) {
                   return tarefa1.titulo < tarefa2.titulo 
                        ? -1 
                        : tarefa1.titulo > tarefa2.titulo 
                                ? 1 
                                : 0
                }
                return tarefa1.concluido - tarefa2.concluido
            })
        }
    },
    created() {
        axios.get(`/tarefas`)
        .then(response => {
            console.log('GET /tarefas ', response)
            this.tarefas = response.data
        }, error => {
            console.log('Erro capturado no then: ', error)
            return Promise.reject(error)
        }).catch(error => {
            console.log('Erro capturado no catch: ', error)
            if (error.response) {
                this.mensagemErro = `Servidor retornou um erro: ${error.message} ${error.response.statusText}`
                console.log('Error [Resposta]: ', error.response)
            } else if (error.request) {
                this.mensagemErro = `Erro ao tentar comunicar com o servidor: ${error.message}`
                console.log('Error [Requisicao]: ', error.request)
            } else {
                this.mensagemErro = `Erro ao fazer requisiçao ao servidor: ${error.message}`
            }
            return 'Repassando para o then abaixo'
        }).then(algumParametro => {
            return console.log('Sempre executado! ', algumParametro)
        })
    },
    methods: {
        criarTarefa(tarefa) {
           axios.post(`/tarefas`, tarefa)
           .then(response => {
               console.log('POST /tarefas ', response)
               this.tarefas.push(response.data)
               this.resetar()
           })
        
            // axios.request({
            //     method: 'post',
            //     baseURL: config.apiURL,
            //     url: `/tarefas`,
            //     data: tarefa
            // })
        },
        editarTarefa(tarefa) {
            console.log('Editar: ', tarefa)
            axios.put(`/tarefas/${tarefa.id}`, tarefa)
            .then(response => {
               console.log(`PUT /tarefas/${tarefa.id}`, response)
               const index = this.tarefas.findIndex(task => task.id === tarefa.id)
               this.tarefas.splice(index, 1, tarefa)
               this.resetar()
            })
        },
        deletarTarefa(tarefa) {
            const confirmar = window.confirm(`Deseja deletar a tarefa "${tarefa.titulo}"?`)
            if (confirmar) {

                axios.delete(`/tarefas/${tarefa.id}`, tarefa)
                .then(response => {
                    console.log(`DELETE /tarefas/${tarefa.id}`, response)
                    const index = this.tarefas.findIndex(task => task.id === tarefa.id)
                    this.tarefas.splice(index, 1)
                })
            }
        },
        exibirFormularioCriarTarefa() {
            if (this.tarefaSelecionada) {
                this.tarefaSelecionada = undefined
                return
            }
            this.exibirFormulario = !this.exibirFormulario
        },
        resetar() {
            this.tarefaSelecionada = undefined
            this.exibirFormulario = false
        },
        selecionarTarefaParaEdicao(tarefa) {
            this.tarefaSelecionada = tarefa
            this.exibirFormulario = true
        }
    }
}
</script>
