<template>
<!--  video-container -->
  <div ref="videoContainer" class="videoContainer relative max-w-[1000px] w-[90%] flex justify-center m-[auto] group/video bg-black" :class="[isPaused ? 'paused':'', isTheater ? 'max-w-[initial] w-full max-h-[90vh]': '', isFullScreen ? 'max-h-[100vh] max-w-[initial] w-full' : '', isScrubbing ? 'scrubbing':'']">
    <!-- video-controls-container -->
    <div class="absolute bottom-0 right-0 left-0 text-white z-[100] opacity-0 transition-opacity ease-in-out group-hover/video:opacity-100 group-[.paused]/video:opacity-100 group-focus-within/video:opacity-100 before:contents-[''] before:absolute before:bottom-0 before:bg-gradient-to-t before:from-black before:w-full before:aspect-[6/1] before:pointer-events-none before:z-[-1]">
      <!-- timeline-container -->
      <div ref="timelineContainer" @mousemove="handleTimeline" @mousedown="toggleScrubbing" class="timeline-container group/timeline h-[7px] ms-2 me-2 cursor-pointer flex items-center">
        <!-- timeline -->
        <div class="timeline bg-[rgb(100,100,100)]/[0.5] h-[3px] w-full relative group-hover/timeline:h-full group-hover/timeline:before:block
          before:contents-[''] before:absolute before:bottom-0 before:left-0 before:top-0 before:bg-[rgb(150,150,150)] before:hidden group-[.scrubbing]/video:before:block group-[.scrubbing]/video:before:h-full
          after:contents=[''] after:absolute after:left-0 after:top-0 after:bottom-0 after:bg-red-600">
          <!-- thumb indicator -->
          <div class="thumb absolute h-[200%] top-[-50%] bg-red-600 rounded-full transition-transform ease-in-out aspect-[1/1]"></div>
        </div>
      </div>
      <!-- controls-->
      <div class="flex gap-2 p-2 items-center">
        <!-- play & pause -->
        <UiBtn @click="toggleFn('isPaused')">
          <Ph.PhPlay :size="32" v-if="isPaused === true" />
          <Ph.PhPause :size="32" v-if="isPaused === false"/>
        </UiBtn>
        <!-- volume button -->
        <div class="flex items-center group/volume">
          <UiBtn>
            <Ph.PhSpeakerHigh :size="32" v-if="volumeLevel.high" @click="setVolume"/>
            <Ph.PhSpeakerLow :size="32" v-if="volumeLevel.low" @click="setVolume"/>
            <Ph.PhSpeakerSlash :size="32" v-if="volumeLevel.muted" @click="setVolume"/>
          </UiBtn>
          <!-- volume slider -->
          <input type="range" v-model="volumeSlider" min="0" max="1" step="any" class="w-0 transition-all ease-in-out origin-left scale-x-0 group-hover/volume:w-[100px] group-hover/volume:scale-x-100 group-focus-within/volume:w-[100px] group-focus-within/volume:scale-x-100">
        </div>
        <!-- duration container -->
        <div class="flex items-center gap-1 grow">
          <span>{{currentTime}}</span>
          <span>/</span>
          <span>{{totalTime}}</span>
        </div>
        <!-- closed caption button -->
        <UiBtn @click="setCaption" :class="isCaption ? 'border-b-[3px] border-red-500' : ''">
          <Ph.PhClosedCaptioning :size="32" />
        </UiBtn>
        <!-- speed button -->
        <UiBtn class="w-[50px]" @click="setSpeed">
          <span>{{speedRate}}</span>
        </UiBtn>
        <!-- mini player -->
        <UiBtn @click="toggleFn('isMini')">
          <Ph.PhPictureInPicture :size="32" />
        </UiBtn>
        <!-- theater button-->
        <UiBtn @click="toggleFn('isTheater')">
          <Ph.PhRectangle :size="32" v-if="isTheater === true"/>
          <Ph.PhPopcorn :size="32" v-if="isTheater === false"/>
        </UiBtn>
        <!-- full screen -->
        <UiBtn @click="toggleFn('isFullScreen')">
          <Ph.PhCornersOut :size="32" v-if="isFullScreen === true"/>
          <Ph.PhCornersIn :size="32" v-if="isFullScreen === false"/>
        </UiBtn>
      </div>
    </div>
    <video autoplay muted ref="video" src="../assets/videos/test.mp4" class="w-full" @click="toggleFn('isPaused')" @timeupdate="setTimeUpdate">
      <track srclang="en" kind="captions" src="../assets/videos/subtitles.vtt">
    </video>
  </div>
</template>
<script setup>
  import * as Ph from "@phosphor-icons/vue";
  const isPaused = ref(false);
  const isTheater = ref(false);
  const isFullScreen = ref(false);
  const isMini = ref(false);
  const videoContainer = ref(null);
  const video = ref(null);
  const volumeSlider = ref(0);
  const volumeLevel = {
    high: false,
    low: false,
    muted: true
  }
  const currentTime = ref('0:00');
  const totalTime = ref('0:00');
  const speedRate = ref('1x');
  const isCaption = ref(false);
  const timelineContainer = ref(null);
  const isScrubbing = ref(false);
  const wasPaused = ref(false);

  const setVolume = () => {
    if(volumeLevel.high) {
      volumeLevel.high = false;
      volumeLevel.low = false;
      volumeLevel.muted = true;
      video.value.muted = true;
      video.value.volume = 0;
      volumeSlider.value = 0;
    } else if(volumeLevel.low) {
      volumeLevel.high = false;
      volumeLevel.low = false;
      volumeLevel.muted = true;
      video.value.muted = true;
      video.value.volume = 0;
      volumeSlider.value = 0;
    } else if(volumeLevel.muted) {
      volumeLevel.high = true;
      volumeLevel.low = false;
      volumeLevel.muted = false;
      video.value.muted = false;
      video.value.volume = 1;
      volumeSlider.value = 1;
    }
  };

  const setSpeed = () => {
    let newRate = video.value.playbackRate + 0.25;
    if(newRate > 2) newRate = 0.25;
    video.value.playbackRate = newRate;
    speedRate.value = `${newRate}x`;
  }

  const setCaption = () => {
    isCaption.value = video.value.textTracks[0].mode === 'hidden';
    video.value.textTracks[0].mode = isCaption.value ? 'showing' : 'hidden';
  }

  const setTimeUpdate = () => {
    currentTime.value = formatDuration(video.value.currentTime);
    const percent = video.value.currentTime / video.value.duration;
    timelineContainer.value.style.setProperty('--progress-position', percent);
  }

  watch(volumeSlider, (val) => {
    if(val === 0 || val === '0') {
      volumeLevel.high = false;
      volumeLevel.low = false;
      volumeLevel.muted = true;
      video.value.muted = true;
      video.value.volume = val;
    } else if(val > 0 && val < 0.5) {
      volumeLevel.high = false;
      volumeLevel.low = true;
      volumeLevel.muted = false;
      video.value.muted = false;
      video.value.volume = val;
    } else if(val >= 0.5) {
      volumeLevel.high = true;
      volumeLevel.low = false;
      volumeLevel.muted = false;
      video.value.muted = false;
      video.value.volume = val;
    }
  });

  const toggleFn = (el) => {
    if(el === 'isPaused') {
      isPaused.value = !isPaused.value;
      isPaused.value ? video.value.pause() : video.value.play();
    } else if(el === 'isTheater') {
      isTheater.value = !isTheater.value;
    } else if(el === 'isFullScreen') {
      isFullScreen.value = !isFullScreen.value;
      document.fullscreenElement == null ? videoContainer.value.requestFullscreen() : document.exitFullscreen();
    } else if(el === 'isMini') {
      isMini.value = !isMini.value;
      isMini.value ? video.value.requestPictureInPicture() : document.exitPictureInPicture();
    }
  };

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  const formatDuration = (time) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    if(hours === 0) return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`;
  };

  const skip = (duration) => {
    video.value.currentTime += duration;
  }

  const toggleScrubbing = (e) => {
    const rect = timelineContainer.value.getBoundingClientRect();
    const percent = Math.min(Math.max(0,e.x - rect.x),rect.width) / rect.width;

    isScrubbing.value = (e.buttons & 1) === 1;
    if(isScrubbing.value) {
      wasPaused.value = video.value.paused;
      video.value.pause();
    } else {
      video.value.currentTime = percent * video.value.duration;
      if(!wasPaused.value) video.value.play();
    }

    handleTimeline(e);
  }

  const handleTimeline = (e) => {
    const rect = timelineContainer.value.getBoundingClientRect();
    const percent = Math.min(Math.max(0,e.x - rect.x),rect.width) / rect.width;

    timelineContainer.value.style.setProperty('--preview-position', percent);
    if(isScrubbing.value) {
      e.preventDefault();
      timelineContainer.value.style.setProperty('--progress-position', percent);
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', (e) => {
      const tagName = document.activeElement.tagName.toLowerCase();
      if(tagName === 'input' || tagName === 'textarea') return;
      switch (e.code) {
        case 'Space':
          if(tagName === 'button') return
        case 'KeyK':
          toggleFn('isPaused');
          break;
        case 'KeyF':
          toggleFn('isFullScreen');
          break;
        case 'KeyI':
          toggleFn('isMini');
          break;
        case 'KeyM':
          setVolume();
          break;
        case 'ArrowLeft':
        case 'keyJ':
          skip(-5)
            break;
        case 'ArrowRight':
        case 'keyI':
          skip(5)
          break;
      }
    });
    document.addEventListener('mouseup', e => {
      if(isScrubbing.value) toggleScrubbing(e);
    });
    document.addEventListener('mousemove', e => {
      if(isScrubbing.value) handleTimeline(e);
    });

    totalTime.value = formatDuration(video.value.duration);
    video.value.textTracks[0].mode = 'hidden';
  });

</script>

<style scoped>
  .timeline:before {
    right: calc(100% - var(--preview-position) * 100%);
  }
  .timeline:after {
    right: calc(100% - var(--progress-position) * 100%);
  }
  .thumb {
    --scale: 0;
    transform: translateX(-50%) scale(var(--scale));
    left:calc(var(--progress-position) * 100%);
  }
  .videoContainer.scrubbing .thumb, .timeline-container:hover .thumb {
    --scale: 1;
  }
</style>