<template>
  <div
    v-if="isLoading"
    class="bg-grey-dark fixed inset-0 z-10 flex items-center justify-center"
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
      <div
        class="relative mx-5 flex w-6/12 flex-col rounded-lg px-5 text-gray-300"
      >
        <h2 class="mb-2 py-2 text-center text-xl text-primary">COMMENT</h2>
        <div
          class="comment mt-1 max-h-full overflow-auto px-3 pb-5"
          v-html="commentInStorage"
        ></div>
      </div>
      <div
        class="flex w-6/12 flex-col rounded-md bg-black/40 px-7 py-5 text-gray-300"
      >
        <Tabs
          default-value="english"
          class="transcription h-full overflow-y-auto px-2"
        >
          <TabsList class="w-full bg-neutral-900">
            <TabsTrigger
              value="english"
              class="w-full"
            >
              English
            </TabsTrigger>
            <TabsTrigger
              value="japanese"
              class="w-full"
            >
              Japanese
            </TabsTrigger>
          </TabsList>
          <TabsContent value="english">
            <div
              class="px-2 py-1 text-lg leading-relaxed"
              v-html="transcriptionInStorage"
            ></div>
          </TabsContent>
          <TabsContent value="japanese">
            <div
              class="px-2 py-1 text-lg leading-relaxed"
              v-html="transcriptionJpInStorage"
            ></div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useStorage } from "@vueuse/core";
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs";
  const comment = useState("comment", () => shallowRef(""));
  const transcription = useState("transcription", () => shallowRef(""));
  const transcriptionJp = useState("transcriptionJp", () => shallowRef(""));
  const commentInStorage = useStorage("comment", "");
  const transcriptionInStorage = useStorage("transcriptionInStorage", "");
  const transcriptionJpInStorage = useStorage("transcriptionJpInStorage", "");
  const isLoading = ref(true);

  onMounted(async () => {
    console.log("comment" + comment.value);
    console.log("transcription" + transcription.value);

    if (comment.value && comment.value !== "") {
      commentInStorage.value = comment.value.split("-->").join("\n");
    }
    if (transcription.value && transcription.value !== "") {
      transcriptionInStorage.value = transcription.value;
    }
    if (transcriptionJp.value && transcriptionJp.value !== "") {
      transcriptionJpInStorage.value = transcriptionJp.value;
    }
    isLoading.value = false;
  });
</script>

<style>
  ::-webkit-scrollbar {
    width: 2px;
    border-radius: 2px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: rgb(18, 18, 18);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
  }

  /* Handle */
  .comment::-webkit-scrollbar-thumb {
    background: #b05800;
  }

  .transcription::-webkit-scrollbar-thumb {
    background: #b1b1b1;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
  }

  .heading {
    font-size: 1.5rem;
    font-weight: 600;
    background-color: #b05800c5;
    padding: 0.25rem;
    margin-bottom: 1rem;
  }

  .paragraph {
    font-size: 1.25rem;
  }

  .paragraph p {
    margin-bottom: 2rem;
  }
</style>
