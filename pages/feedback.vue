<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 z-10 flex items-center justify-center bg-grey-dark"
  >
    <div
      v-if="isLoading"
      class="z-30 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-primary"
    ></div>
  </div>
  <div
    class="mx-auto flex h-screen w-[60rem] flex-col items-center justify-center"
  >
    <NuxtLink
      class="fixed right-10 top-7 flex gap-1 text-lg text-primary opacity-90 transition-transform duration-300 hover:scale-110 hover:opacity-100"
      to="/"
      ><img
        class="w-6"
        src="../assets/images/home.svg"
      />HOME</NuxtLink
    >
    <div class="flex h-[75vh] gap-5">
      <div class="relative mx-5 flex w-3/5 flex-col px-5 text-gray-300">
        <h2
          class="mb-2 border-b border-t border-primary py-3 text-center text-xl text-primary"
        >
          Comments
        </h2>
        <div class="mt-1 max-h-full overflow-auto px-3 pb-5 text-lg leading-9">
          {{ feedbackInStorage }}
        </div>
      </div>
      <div
        class="flex w-2/5 flex-col rounded-md bg-black/40 px-7 py-5 text-gray-300"
      >
        <h2 class="mb-2 text-center text-xl">Chat Log</h2>
        <div class="overflow-auto px-2 py-1 text-lg">
          {{ transcriptionInStorage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  const feedback = useState("feedback", () => shallowRef(""));
  const transcription = useState("transcription", () => shallowRef(""));
  const feedbackInStorage = useStorage("feedback", "");
  const transcriptionInStorage = useStorage("transcriptionInStorage", "");
  const isLoading = ref(true);

  onMounted(() => {
    if (feedback.value && feedback.value !== "") {
      feedbackInStorage.value = feedback.value;
    }
    if (transcription.value && transcription.value !== "") {
      transcriptionInStorage.value = transcription.value;
    }
    isLoading.value = false;
  });
</script>

<style>
  .overflow-auto::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #ffffff00;
  }
</style>
