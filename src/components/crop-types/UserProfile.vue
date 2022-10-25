<script setup>
import { onMounted, ref } from 'vue';
import CtrlAltElite from '../../../package/src/class';

const croppable = ref(false);

function initializeCropperJS() {
  const element = document.querySelector('#upload-image-button-wrapper > svg');
  const options = {
    debug: true,
    debugPrefix: 'CtrlAltElite',
    cropView: 'avatar',
    elementId: 'unique',
    replaceExistingElement: false,
    onSuccess(imageUrl) {
      const targetElement = document.getElementById('target');
      targetElement.style.backgroundImage = `url('${imageUrl}')`;
    },
    cropperjs: {
      aspectRatio: 1,
      autoCropArea: 0.5,
      viewMode: 1,
      ready: () => {
        croppable.value = true;
      },
    },
  };

  new CtrlAltElite(element, options);
}

onMounted(() => {
  if (!document.querySelector('.ctrl-alt-elite')) initializeCropperJS();
});
</script>

<script>
import { UserCircleIcon, EnvelopeIcon, FaceSmileIcon } from '@heroicons/vue/24/solid';

export default {
  name: 'UserProfile',
  components: {
    UserCircleIcon,
    EnvelopeIcon,
    FaceSmileIcon,
  },
};
</script>

<template>
  <div class="grid h-fit place-items-center">
    <div class="w-[600px] h-[800px] bg-slate-100 drop-shadow-lg mt-20 rounded-3xl">
      <div class="grid grid-rows-3 grid-cols-12 gap-y-10 gap-x-6 m-6">
        <div class="row-start-1 col-span-12 text-sky-500 text-4xl justify-self-start mt-6">User Settings</div>
        <div class="row-start-2 col-span-12 text-3xl text-gray-500 justify-self-start ml-6">Profile</div>
        <div class="row-start-3 col-start-1 col-end-2"><EnvelopeIcon class="w-10 h-10 text-slate-400" /></div>
        <div class="row-start-3 col-span-11">
          <input
            type="text"
            id="email"
            class="bg-transparent border-dotted border-b-2 border-gray-300 text-gray-900 block w-full p-2.5 focus:outline-none"
            placeholder="Email"
          />
        </div>
        <div class="row-start-4 col-start-1 col-end-2"><UserCircleIcon class="w-10 h-10 text-slate-400" /></div>
        <div class="row-start-4 col-span-5 b">
          <input
            type="text"
            id="first_name"
            class="bg-transparent border-b-2 border-gray-300 text-gray-900 block w-full p-2.5 focus:outline-none"
            placeholder="First name"
          />
        </div>
        <div class="row-start-4 col-span-1"><UserCircleIcon class="w-10 h-10 text-slate-400" /></div>
        <div class="row-start-4 row-span-1 col-span-5">
          <input
            type="text"
            id="first_name"
            class="bg-transparent border-b-2 border-gray-300 text-gray-900 block w-full p-2.5 focus:outline-none"
            placeholder="Last name"
          />
        </div>
        <div id="upload-image-button-wrapper" class="row-start-5 col-start-1 col-end-3">
          <FaceSmileIcon class="w-14 h-14 text-slate-400" />
        </div>
        <div class="row-start-5 col-span-10 row-start-3">
          <input
            type="text"
            id="email"
            class="bg-transparent border-b-2 border-gray-300 text-gray-900 block w-full p-2.5 focus:outline-none"
            placeholder="Display Name (ex. Sgt. Pepper)"
          />
        </div>
      </div>
      <div id="target"></div>
    </div>
  </div>
</template>

<style scoped>
#target {
  width: 100%;
  height: 200px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
