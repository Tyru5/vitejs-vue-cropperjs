<script setup>

// Custom image element for redner the CropperJS instance:
import ImageElement from './components/ImageElement.vue';

</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <a href="https://fengyuanchen.github.io/cropperjs/" target="_blank">
      <img src="./assets/cropperjs2_logo.svg" class="logo cropperjs" alt="CropperJS logo" />
    </a>
  </div>
  <ImageElement msg="Vite + Vue + CropperJS" image-ref="../src/assets/ty.jpg"/>
</template>

<style scoped>
.logo {
  height: 6em;
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
