<template>
  <div id="app" class="container">

    <h1>Components Dinâmicos</h1>

    <button @click="componentSelecionado = 'Assincrono'">Assincrono</button>
    <button @click="componentSelecionado = 'Contato'">Contato</button>
    <button @click="componentSelecionado = 'Home'">Home</button>
    <button @click="componentSelecionado = 'PostsLista'">Posts</button>
    <button @click="componentSelecionado = 'Sobre'">Sobre</button>

    <p>{{ componentSelecionado }}</p>

    <keep-alive include="Sobre">
      <component 
        :is="componentSelecionado"
        v-bind="propsAtuais">

      </component>
    </keep-alive>

  </div>
</template>

<script>
import Home from "./components/Home";
import PostsLista from "./components/PostsLista";
import Sobre from "./components/Sobre";

const Contato = {
  render: (h) => h({ 
    name: 'ContatoDados',
    template: '<h2>Component Anonimo</h2>'
  })
}

export default {
  components: {
    Assincrono: () => ({
      component:  new Promise((resolve) => { 

        setTimeout(() => {
          resolve(import('./components/Assincrono'))
        }, 2000);

       }),
      loading: { template: '<p>Loading...</p>'},
      error: { template: '<p>Error on loading component</p>' },
      delay: 200,
      timeout: 3000
    }),
    Contato,
    Home,
    PostsLista,
    Sobre
  },
  data() {
    return {
      componentSelecionado: 'Home',
      posts: [
        { id: 1, titulo: 'Components no Vue', conteudo: 'Components sao uma das peças mais importantes no Vue', autor: 'Eduardo Klein' },
        { id: 2, titulo: 'Distribuindo conteúdo com Slots', conteudo: 'Slots podem ser usados como repositórios de código HTML', autor: 'Eduardo Klein' }
      ]
    }
  },
  computed: {
    propsAtuais() {
      return this.componentSelecionado === 'PostsLista' ? { posts: this.posts } : {}
    }
  }
};
</script>

<style scoped>
 .container {
   width: 960px;
   margin: auto;
 }
</style>
