<script setup>
import { onMounted, ref } from 'vue';

import CtrlAltElite from '../../package/src/class';

const croppable = ref(false);
const cropper = ref(null);

// Defined props:
defineProps({
  msg: String,
  imageRef: {
    type: String,
    required: true,
  },
});

function initializeCropperJS() {
  const image = document.getElementById('image');
  const options = {
    aspectRatio: 1,
    autoCropArea: 0.5,
    viewMode: 1,
    ready: () => {
      croppable.value = true;
      console.log('YEET!');
    },
    debug: true,
    debugPrefix: 'CtrlAltElite',
  };
  cropper.value = new CtrlAltElite(image, options);
}

function resetCropper() {
  cropper.value.reset();
}

function destroyCropper() {
  cropper.value.destroy();
}

onMounted(() => {
  window.addEventListener('DOMContentLoaded', () => {
    initializeCropperJS();
  });
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <!-- Wrap the image or canvas element with a block element (container) -->
  <div class="flex-center">
    <img id="image"/>
  </div>

</template>

<style scoped lang="scss">
/* Ensure the size of the image fit the container perfectly */
img {
  display: block;

  width: 700px;
  height: 700px;

  border-radius: 17px;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
  transition: filter 300ms ease-in;
}

img:hover {
  transition: filter 300ms ease-out;
  filter: drop-shadow(0 0 1em #646cffaa);
}

.flex-center {
  display: flex;
  justify-content: center;
}
</style>
