<template>
    <div>
      <div class="alert alert-danger">
        <h3 class="text-center">Error 404!</h3>    
        <p class="text-center">Página nao encontrada.</p>
      </div>  
      <button class="btn btn-secondary mb-4 mt-4" @click="$router.back()">Voltar</button>
    </div>    
</template>