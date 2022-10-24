<script setup>

import { onMounted } from 'vue';

// Defined props:
const props = defineProps({
  msg: String,
  imageRef: {
    type: String,
    required: true,
  }
});


onMounted(() => {
  console.log('what is even going on', { props: props.msg, another: props.imageRef });
});

</script>

<template>
  <h1>{{ msg }}</h1>

  

  <!-- Wrap the image or canvas element with a block element (container) -->
  <div>
    <img id="image" :src="imageRef">
  </div>
</template>

<style scoped>
/* Ensure the size of the image fit the container perfectly */
img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>