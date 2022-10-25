<script>
import { Bars3BottomLeftIcon, LinkIcon, PaperClipIcon, DocumentIcon} from '@heroicons/vue/24/outline'

export default {
  name: 'UserProfile',
  components: {
    DocumentIcon,
    PaperClipIcon,
    LinkIcon,
    Bars3BottomLeftIcon
  }
}
</script>

<template>
  <div class="">
    <div class="w-[600px] h-[700px] bg-slate-100 drop-shadow-lg flex flex-col gap-6">
      <div class="flex justify-between p-6 bg-sky-400">
        <div class="self-start text-white font-bold text-xl	">X</div>
            <p class="self-center text-white font-semibold">Add resource to New Module 1</p>
            <DocumentIcon class="w-6 h-6 text-white"/>
      </div>
      <h1 class="self-start px-6 text-2xl font-light">Add Attachment</h1>
      <div class="px-6 flex items-center">
        <PaperClipIcon class="w-6 h-6 text-slate-400"/>
        <input type="text" id="email" class="bg-transparent border-b-2 border-gray-300 text-gray-900 p-2.5 focus:outline-none grow" placeholder="PDF, Doc, CSV, or Image">
      </div>
      <h1 class="self-start px-6 text-2xl font-light">Add Web Embed</h1>
       <div class="px-6 flex items-center">
        <LinkIcon class="w-6 h-6 text-slate-400"/>
        <input type="text" id="email" class="bg-transparent border-b-2 border-gray-300 text-gray-900 p-2.5 focus:outline-none grow" placeholder="Insert Website URL">
      </div>
      <h1 class="self-start px-6 text-2xl font-light">Add Text Item</h1>
      <div></div>
      <div>
        <div></div>
        <div></div>
      </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>


</style>
