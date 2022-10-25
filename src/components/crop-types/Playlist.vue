<script setup>
import { onMounted, ref } from 'vue';
import CtrlAltElite from '../../../package/src/class';

const croppable = ref(false);

function initializeCropperJS() {
  const element = document.getElementById('upload-image-button');
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
import { ChatBubbleBottomCenterIcon, Bars3BottomLeftIcon, LinkIcon, PaperClipIcon, DocumentIcon} from '@heroicons/vue/24/outline'

export default {
  name: 'Playlist',
  components: {
    DocumentIcon,
    PaperClipIcon,
    LinkIcon,
    Bars3BottomLeftIcon,
    ChatBubbleBottomCenterIcon
  }
}
</script>

<template>
  <div class="grid h-fit place-items-center">
    <div class="w-[600px] h-[900px] bg-slate-100 drop-shadow-lg flex flex-col gap-6 mt-20">
        <div class="flex justify-between p-6 bg-sky-400">
            <div class="self-start text-white font-bold text-xl	">X</div>
            <p class="self-center text-white font-semibold">Add resource to New Module 1</p>
            <DocumentIcon class="w-6 h-6 text-white"/>
        </div>
        <h1 class="self-start px-6 text-2xl font-light text-gray-500">Add Attachment</h1>
        <div class="px-6 flex items-center">
            <PaperClipIcon class="w-6 h-6 text-slate-400"/>
            <input type="text" id="upload-image-button" class="bg-transparent border-b-2 border-gray-300 text-gray-900 p-2.5 focus:outline-none grow" placeholder="PDF, Doc, CSV, or Image">
        </div>
        <h1 class="self-start px-6 text-2xl font-light text-gray-500">Add Web Embed</h1>
        <div class="px-6 flex items-center">
            <LinkIcon class="w-6 h-6 text-slate-400"/>
            <input type="text" id="webEmbed" class="bg-transparent border-b-2 border-gray-300 text-gray-900 p-2.5 focus:outline-none grow" placeholder="Insert Website URL">
        </div>
        <div class="flex space-x-2 justify-end ">
                <button type="button" class="inline-block w-30 px-6 py-2.5 bg-zinc-300 text-zinc-400 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:slate-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-zinc-600 active:shadow-lg transition duration-150 ease-in-out font-semibold tracking-widest mr-6">ADD LINK</button>
        </div>
        <h1 class="self-start px-6 text-2xl font-light text-gray-500">Add Text Item</h1>
        <div class="px-6 flex items-center">
            <Bars3BottomLeftIcon class="w-6 h-6 text-slate-400"/>
            <input type="text" id="textTitle" class="bg-transparent border-b-2 border-gray-300 text-gray-900 p-2.5 focus:outline-none grow" placeholder="Text Title">
        </div>
        <div class="px-6 flex">
            <ChatBubbleBottomCenterIcon class="w-6 h-6 text-slate-400"/>
            <textarea type="text" id="textDescription" class="bg-transparent border-b-2 border-gray-300 text-gray-900 pl-2 focus:outline-none grow" placeholder="Text Description"></textarea>
        </div>
        <div class="flex space-x-2 justify-end ">
                <button type="button" class="inline-block w-30 px-6 py-2.5 bg-zinc-300 text-zinc-400 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-slate-500 hover:shadow-lg focus:slate-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-zinc-600 active:shadow-lg transition duration-150 ease-in-out font-semibold tracking-widest mr-6">ADD TEXT</button>
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
