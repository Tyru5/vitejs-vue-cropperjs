<script setup>
import { onMounted, ref } from 'vue';
import CtrlAltElite from '../../../package/src/class';

const croppable = ref(false);

function initializeCropperJS() {
  const element = document.querySelector('#upload-image-button-wrapper > svg');
  const options = {
    debug: true,
    debugPrefix: 'CtrlAltElite',
    cropView: 'portrait',
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
    }
  };
  new CtrlAltElite(element, options);
}

onMounted(() => {
  if (!document.querySelector('.ctrl-alt-elite')) initializeCropperJS();
});
</script>

<script>
import { VideoCameraIcon, MicrophoneIcon, PaperClipIcon, PhotoIcon, Cog6ToothIcon, FaceSmileIcon, EllipsisVerticalIcon, ChevronUpDownIcon} from '@heroicons/vue/24/solid'

export default {
  name: 'Designer',
  components: {
      VideoCameraIcon,
      MicrophoneIcon,
      PaperClipIcon,
      PhotoIcon,
      Cog6ToothIcon,
      FaceSmileIcon,
      ChevronUpDownIcon
  }
}
</script>

<template>
  <div class="grid h-fit place-items-center">
    <div class="w-[600px] h-[700px] bg-slate-100 drop-shadow-lg flex flex-col gap-6 mt-20">
        <div class="flex justify-center items-center p-6 bg-white shadow-black-500/50 border-b-4">
            <div class="rounded-full w-7 h-7 bg-gray-300 text-center"><span class="inline-block mx-1 mt-1 font-bold text-white">1</span></div>
            <hr class="my-4 mx-auto w-48 h-px bg-gray-300 rounded border-0 md:my-10 dark:bg-gray-700">
            <div class="rounded-full w-7 h-7 bg-gray-300"><span class="inline-block mx-1 mt-1 font-bold text-white">2</span></div>
            <hr class="my-4 mx-auto w-48 h-px bg-gray-300 rounded border-0 md:my-10 dark:bg-gray-700">
            <div class="rounded-full w-7 h-7 bg-gray-300"><span class="inline-block mx-1 mt-1 font-bold text-white">3</span></div>
        </div>
        <button class="w-52 self-center bg-gray-200 p-6 flex rounded hover:border-gray-200 focus:outline-none">
            <p>Free response</p>
            <ChevronUpDownIcon class="w-6 h-6 text-slate-400 ml-6 "/>
        </button>
        <div class="flex justify-between self-center border border-gray-300 p-2 w-96">
            <button class="hover:border-gray-200 focus:outline-none"><VideoCameraIcon class="w-5 h-5 text-black"/></button>
            <button class="hover:border-gray-200 focus:outline-none"><MicrophoneIcon class="w-5 h-5 text-black"/></button>
            <button class="hover:border-gray-200 focus:outline-none"><PaperClipIcon class="w-5 h-5 text-black"/></button>
            <button id="upload-image-button-wrapper" class="hover:border-gray-200 focus:outline-none"><PhotoIcon class="w-5 h-5 text-black"/></button>
            <button class="hover:border-gray-200 focus:outline-none"><FaceSmileIcon class="w-5 h-5 text-black"/></button>
        </div>
        <div class="flex self-center">
            <div class="border-b-4 border-sky-400 mx-9 w-96"></div>
            <button class="hover:border-gray-200 focus:outline-none"><Cog6ToothIcon class="w-6 h-6 text-slate-400"/></button>
        </div>
        <div class="self-start ml-24 text-sm tracking-wider	"><button class="hover:border-gray-200 focus:outline-none">Advanced</button></div>
        <div>
            <button type="button" class="inline-block bg-transparent w-30 px-6 py-2.5 text-zinc-400 font-medium text-xs leading-tight uppercase  hover:shadow-lg hover:border-slate-400 focus:slate-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-zinc-600 active:shadow-lg transition duration-150 ease-in-out font-semibold tracking-widest mr-6 rounded-none	">CANCEL</button>
            <button type="button" class="inline-block w-30 px-6 py-2.5 bg-sky-300 text-white font-medium text-xs leading-tight uppercase  shadow-md hover:shadow-lg hover:border-slate-400 focus:slate-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-zinc-600 active:shadow-lg transition duration-150 ease-in-out font-semibold tracking-widest mr-6 rounded-none	">DONE</button>
            <button type="button" class="inline-block w-30 px-6 py-2.5 bg-transparent border-2 border-sky-300 text-sky-400  font-medium text-xs leading-tight uppercase  shadow-md  focus:slate-500 focus:shadow-lg focus:outline-none active:bg-zinc-600 rounded-none	active:shadow-lg transition duration-150 ease-in-out font-extrabold tracking-widest mr-6">CUSTOMIZE</button>
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
