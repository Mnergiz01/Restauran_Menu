<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
    <footer></footer>

  </div>
</template>

<script setup>
import footer from './components/footer.vue';
</script>