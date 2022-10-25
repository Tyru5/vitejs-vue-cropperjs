<script setup>
// Core Vue imports:
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

import ConfettiGenerator from 'confetti-js';

// Demo Components
import NavBar from './components/NavBar.vue';
import BulbSettings from './components/crop-types/BulbSettings.vue';
import WeVideo from './components/crop-types/WeVideo.vue';
import ImageElement from './components/crop-types/ImageElement.vue';
import Designer from './components/crop-types/Designer.vue';
import Playlist from './components/crop-types/Playlist.vue';
import UserProfile from './components/crop-types/UserProfile.vue';

const store = useStore();

const navOptions = ref([
  { name: 'User Profile', nav: 'userProfile', href: '#', current: true },
  { name: 'Bulb Settings', nav: 'bulbSettings', href: '#', current: false },
  { name: 'Playlist', nav: 'playlist', href: '#', current: false },
  { name: 'WeVideo', nav: 'weVideo', href: '#', current: false },
  { name: 'Designer', nav: 'designer', href: '#', current: false },
  { name: 'Standalone', nav: 'standalone', href: '#', current: false },
]);

const konamiCode = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

let konamiCurrentInput = 0;

function launchConfetti() {
  const confettiSettings = {
    target: 'confetti-container',
    max: 450,
    props: [
      'circle',
      'square',
      'triangle',
      'line',
      {
        type: 'svg',
        src: 'https://cdn.jsdelivr.net/gh/Tyru5/Tyru5/assets/gifs/dachshund-svgrepo-com.svg',
        weight: 0.5,
        size: 25,
      },
      {
        type: 'svg',
        src: 'https://cdn.jsdelivr.net/gh/Tyru5/Tyru5/assets/gifs/WeVideo_logo.png',
        weight: 0.5,
        size: 25,
      },
    ],
    clock: 55,
    rotate: true,
    start_from_edge: true,
    respawn: false,
  };
  const confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
}

function listenForKonamiCode() {
  if (konamiCode.indexOf(event.key) < 0 || event.key !== konamiCode[konamiCurrentInput]) {
    konamiCurrentInput = 0;
    return;
  }
  konamiCurrentInput += 1;
  if (konamiCode.length !== konamiCurrentInput) return;
  konamiCurrentInput = 0;
  launchConfetti();
}

onMounted(() => {
  document.addEventListener('keydown', listenForKonamiCode);
});
</script>

<template>
  <!-- More than one root node! :) Vue 3 is awesome :100: -->
  <canvas id="confetti-container"></canvas>
  <NavBar :navScreens="navOptions"></NavBar>
  <BulbSettings v-if="store.state.activeNav === 'bulbSettings'"></BulbSettings>
  <WeVideo v-else-if="store.state.activeNav === 'weVideo'"></WeVideo>
  <Designer v-else-if="store.state.activeNav === 'designer'"></Designer>
  <Playlist v-else-if="store.state.activeNav === 'playlist'"></Playlist>
  <UserProfile v-else-if="store.state.activeNav === 'userProfile'"></UserProfile>
  <ImageElement v-else-if="store.state.activeNav === 'standalone'" msg="Vite + Vue + CropperJS" />
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

#confetti-container {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
  z-index: 99999999999;
  pointer-events: none;
}
</style>
