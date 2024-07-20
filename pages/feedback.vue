<template>
  <div class="mx-auto flex w-[50rem] flex-col items-center justify-center">
    <NuxtLink
      class="fixed right-10 top-10 flex gap-1 text-2xl font-bold text-primary"
      to="/"
      ><img src="../assets/images/home.svg" />HOME</NuxtLink
    >
    <h1 class="mt-10 text-3xl font-semibold text-primary">FEEDBACK</h1>
    <div
      class="relative mt-20 flex aspect-square h-[70vh] flex-col text-orange-white"
    >
      <div class="mb-8 h-[1px] w-full rounded-full bg-primary"></div>
      <h2 class="text-center text-xl font-bold">アドバイス</h2>
      <p class="mx-5 my-9 max-h-full overflow-auto text-xl leading-9">
        {{ data }}
      </p>
      <div
        class="absolute bottom-0 mt-8 h-[1px] w-full rounded-full bg-primary"
      ></div>
    </div>
    <p></p>
  </div>
</template>

<script lang="ts" setup>
  const data = useState("data", () => shallowRef(""));
</script>

<style>
  .overflow-auto::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #cccccc00;
  }
</style>
