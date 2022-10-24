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
  cropper.value = new CtrlAltElite(image, {
    aspectRatio: 1,
    autoCropArea: 0.5,
    viewMode: 1,
    ready: () => {
      croppable.value = true;
    },
  });
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
  <div>
    <img id="image" :src="imageRef" />
  </div>

  <p class="croppable-alert">Has CropperJS initialized?: {{ croppable }}</p>

  <!-- Cropper actions container -->
  <div class="cropper-actions-container">
    <button class="action reset" @click="resetCropper()">Reset CropperJS</button>
    <button class="action destroy" @click="destroyCropper()">Destroy CropperJS</button>
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

/* actions container stying */
.cropper-actions-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
