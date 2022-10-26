<script setup>
import { onMounted, ref } from 'vue';

import CtrlAltElite from '../../../package/src/class';

const croppable = ref(false);

// Defined props:
defineProps({
  msg: String,
});

function initializeCropperJS() {
  const image = document.getElementById('target');
  const options = {
    debug: true,
    debugPrefix: 'CtrlAltElite',
    cropView: 'avatar',
    elementId: 'unique',
    cropperjs: {
      aspectRatio: 1,
      autoCropArea: 0.5,
      viewMode: 1,
      ready: () => {
        croppable.value = true;
      },
    }
  };
  const image2 = document.getElementById('target2');
  const options2 = {
    debug: true,
    debugPrefix: 'CtrlAltElite',
    cropView: 'landscape',
    elementId: 'unique',
    cropperjs: {
      aspectRatio: 1,
      autoCropArea: 0.5,
      viewMode: 1,
      ready: () => {
        croppable.value = true;
      },
    }
  };
  const image3 = document.getElementById('target3');
  const options3 = {
    debug: true,
    debugPrefix: 'CtrlAltElite',
    cropView: 'portrait',
    elementId: 'unique',
    cropperjs: {
      aspectRatio: 1,
      autoCropArea: 0.5,
      viewMode: 1,
      ready: () => {
        croppable.value = true;
      },
    }
  };
  new CtrlAltElite(image, options);
  new CtrlAltElite(image2, options2);
  new CtrlAltElite(image3, options3);
}

onMounted(() => {
  if (!document.querySelector('.ctrl-alt-elite')) initializeCropperJS();
});

</script>

<template>
  <h1 class="font-mono m-20 text-2xl">{{ msg }}</h1>

  <!-- Wrap the image or canvas element with a block element (container) -->
  <div class="flex-center">
    <div>
      <p class="font-mono">avatar</p>
      <img id="target" />
    </div>
    <div>
      <p class="font-mono">landscape</p>
      <img id="target2" />
    </div>
    <div>
      <p class="font-mono">portrait</p>
      <img id="target3" />
    </div>
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
  justify-content: space-evenly;
  align-items: center;
}
</style>
