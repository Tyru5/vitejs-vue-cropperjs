<script setup>
import { useStore } from 'vuex';
import NavBar from './components/NavBar.vue';
import BulbSettings from './components/crop-types/BulbSettings.vue';
import WeVideo from './components/crop-types/WeVideo.vue';
// Custom image element for redner the CropperJS instance:
import ImageElement from './components/crop-types/ImageElement.vue';
import Designer from './components/crop-types/Designer.vue';
import Playlist from './components/crop-types/Playlist.vue';
import UserProfile from './components/crop-types/UserProfile.vue';
import { ref } from 'vue';

const store = useStore();

const navOptions = ref(
  [
    { name: 'User Profile', nav: 'userProfile', href: '#', current: true },
    { name: 'Bulb Settings', nav: 'bulbSettings', href: '#', current: false },
    { name: 'Playlist', nav: 'playlist', href: '#', current: false },
    { name: 'WeVideo', nav: 'weVideo', href: '#', current: false },
    { name: 'Designer', nav: 'designer', href: '#', current: false },
    { name: 'Image', nav: 'image', href: '#', current: false },
  ],
)
</script>

<template>
  <NavBar :navScreens="navOptions"></NavBar>
  <BulbSettings v-if="store.state.activeNav === 'bulbSettings'"></BulbSettings>
  <WeVideo v-else-if="store.state.activeNav === 'weVideo'"></WeVideo>
  <Designer v-else-if="store.state.activeNav === 'designer'"></Designer>
  <Playlist v-else-if="store.state.activeNav === 'playlist'"></Playlist>
  <UserProfile v-else-if="store.state.activeNav === 'userProfile'"></UserProfile>
  <ImageElement v-else msg="Vite + Vue + CropperJS" image-ref="../src/assets/ty.jpg" />
</template>

<style scoped>
.logo {
  height: 2em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.logo.cropperjs:hover {
  filter: drop-shadow(0 0 2em #0293faaa);
}

.display-none {
  display: none;
}
</style>
