<template>
  <div class="relative min-h-screen bg-gradient-to-t from-black to-grey-dark">
    <slot />
    <img
      class="absolute left-4 top-4 h-10"
      src="../assets/images/insight-crow_landscape.svg"
      alt=""
    />
  </div>
</template>
<script setup lang="ts"></script>
<style>
  p {
    color: #f6f2ef;
  }
</style>
