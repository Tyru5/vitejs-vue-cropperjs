<script setup>
import NavBar from './components/NavBar.vue';
// Custom image element for redner the CropperJS instance:
import ImageElement from './components/ImageElement.vue';

</script>

<template>
  <NavBar></NavBar>
  <ImageElement msg="Vite + Vue + CropperJS" image-ref="../src/assets/ty.jpg" />
</template>

<style scoped>
.logo {
  height: 2em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.logo.cropperjs:hover {
  filter: drop-shadow(0 0 2em #0293faaa);
}
</style>
