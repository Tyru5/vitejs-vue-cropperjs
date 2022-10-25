<script setup>
import { VideoCameraIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue';
import CtrlAltElite from '../../../package/src/class';

const croppable = ref(false);

// Defined props:
defineProps({
  msg: String,
});

function initializeCropperJS() {
  const element = document.getElementById('image');
  const options = {
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
  new CtrlAltElite(element, options);
}

onMounted(() => {
  if (!document.querySelector('.ctrl-alt-elite')) initializeCropperJS();
});
</script>

<template>
  <div class="grid h-fit place-items-center">
    <div class="w-[900px] h-[450px] bg-slate-100 drop-shadow-lg flex flex-col gap-6 mb-5 mt-20">
      <div class="flex justify-between p-6 bg-sky-400 mb-5">
        <div class="self-start text-white font-bold text-xl	">X</div>
        <p class="self-center text-white font-semibold">Update settings for Intro to Vue 3's composition API</p>
        <VideoCameraIcon class="w-6 h-6 text-white" />
      </div>
      <div class="grid grid-rows-3 grid-flow-col gap-4">
        <div class="row-span-3 grid content-center">
          <image id="image" />
        </div>
        <div class="col-span-2">
          <h1 class="px-6 text-md text-slate-600 text-left">Bulb Name</h1>
          <div class="px-6 flex pb-5">
            <input type="text" id="email"
              class="bg-transparent border-b-2 border-gray-300 text-gray-900 p-2.5 focus:outline-none grow"
              placeholder="Intro to Vue 3's composition API">
          </div>
        </div>
        <div class="row-span-2 col-span-2">
          <h1 class="self-start px-6 text-md text-slate-600 text-left">Learning Objective</h1>
          <div class="px-6 flex items-center">
            <input type="text" id="email"
              class="bg-transparent border-b-2 border-gray-300 text-gray-900 p-2.5 focus:outline-none grow"
              placeholder="Build your first Vue 3 application">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
