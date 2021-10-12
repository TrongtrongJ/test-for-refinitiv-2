<script setup lang="ts">
import { onMounted } from 'vue'
import { 
  isLoading, httpError,
  searchInput,
  filteredCategoriesData, 
  initializeStore,
} from './state'

onMounted(() => {
  initializeStore()
})
</script>

<template>
<div class="main-container">
  <div v-if="isLoading">
    Fetching Data
  </div>
  <div v-else>
    <div v-for="cat of filteredCategoriesData" class="category-card">
      {{cat}}
    </div>
  </div>
</div>
</template>

<style>
.main-container {
  display: flex;
  justify-content: center;
  justify-items: center;
}

.category-card {
  box-sizing: border-box;
  border: 1px solid salmon;
  height: 10vh;
  margin: 3px 0;
  border-radius: 5px;
  text-align: center;
}
</style>
