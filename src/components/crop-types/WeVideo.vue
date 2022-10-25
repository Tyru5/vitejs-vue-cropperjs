<script setup>
import { PhotoIcon, VideoCameraIcon, FolderIcon, MusicalNoteIcon, LanguageIcon, HomeModernIcon, CloudArrowUpIcon, MicrophoneIcon, EyeIcon, AdjustmentsHorizontalIcon, FunnelIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref, onUpdated} from 'vue';
import CtrlAltElite from '../../../package/src/class';

const croppable = ref(false);

// Defined props:
defineProps({
  msg: String,
});

function initializeCropperJS() {
  const element = document.getElementById('upload-image-button');
  const options = {
    debug: true,
    debugPrefix: 'CtrlAltElite',
    cropView: 'portrait',
    elementId: 'unique',
    replaceExistingElement: false,
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
  initializeCropperJS();
});
</script>

<template>
  <div class="grid h-screen place-items-center">
    <div class="w-[800px] h-[600px] bg-zinc-600 drop-shadow-lg flex flex-col gap-6 mb-5">
      <div class="grid grid-rows-3 grid-flow-col gap-4 mt-5">
        <div class="row-span-3">
          <ul class="list-none pt-5">
            <li>
              <div class="px-6 flex items-center">
                <FolderIcon class="w-6 h-6 text-slate-400" />
                <p class="pl-3">My media</p>
              </div>
            </li>
            <li class="pt-3">
              <div class="px-6 flex items-center">
                <VideoCameraIcon class="w-6 h-6 text-slate-400" />
                <p class="pl-3">Videos</p>
              </div>
            </li>
            <li class="pt-3">
              <div class="px-6 flex items-center">
                <PhotoIcon class="w-6 h-6 text-slate-400" />
                <p class="pl-3">Images</p>
              </div>
            </li>
            <li class="pt-3">
              <div class="px-6 flex items-center">
                <MusicalNoteIcon class="w-6 h-6 text-slate-400" />
                <p class="pl-3">Audio</p>
              </div>
            </li>
            <li class="pt-3">
              <div class="px-6 flex items-center">
                <LanguageIcon class="w-6 h-6 text-slate-400" />
                <p class="pl-3">Text</p>
              </div>
            </li>
            <li class="pt-3">
              <div class="px-6 flex items-center">
                <HomeModernIcon class="w-6 h-6 text-slate-400" />
                <p class="pl-3">Backgrounds</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-span-2 pt-5">
          <div class="px-6 flex pb-5 justify-end">
            <button id="upload-image-button">
              <div class="px-6 flex items-center text-sky-500">
                <CloudArrowUpIcon class="w-6 h-6 text-sky-500" />
                <p class="pl-3">Import</p>
              </div>
            </button>
            <button>
              <div class="px-6 flex items-center text-sky-500">
                <EyeIcon class="w-6 h-6 text-sky-500" />
                <p class="pl-3">Record</p>
              </div>
            </button>
            <button>
              <div class="px-6 flex items-center text-sky-500">
                <MicrophoneIcon class="w-6 h-6 text-sky-500" />
                <p class="pl-3">Narrate</p>
              </div>
            </button>
            <AdjustmentsHorizontalIcon class="w-6 h-6 text-slate-400 mr-2" />
            <FunnelIcon class="w-6 h-6 text-slate-400" />
          </div>
        </div>
        <div class="row-span-2 col-span-2">
          <div class="px-6 flex items-center">
            <FolderIcon class="w-20 h-20 text-slate-400 mr-3" />
            <img src="../../assets/WeVideoDemoShot.png" class="p-1 rounded max-w-sm" alt="WeVideo Demo picture" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
