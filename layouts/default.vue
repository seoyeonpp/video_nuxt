<template>
  <div :class="isDark ? 'dark' : ''">
    <div class="dark:text-white dark:bg-black">
      <slot/>
    </div>
  </div>
  <Transition>
    <Spinner v-if="spinnerAll"/>
  </Transition>
</template>

<script setup lang="ts">
import Spinner from "~/components/Spinner.vue";
import {useDarkMode , useSpinnerAll} from "~/composables/state";

const spinnerAll = useSpinnerAll();
const isDark = useDarkMode();

</script>