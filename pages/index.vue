<template>
  <div
    v-if="showUploadModal"
    class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
  ></div>
  <div class="relative flex min-h-screen flex-col">
    <div class="flex flex-shrink justify-center">
      <h1 class="mt-6 text-3xl font-medium text-primary">HOME</h1>
    </div>
    <img
      class="absolute right-8 top-6 z-10 h-10 w-10 cursor-pointer"
      src="../assets/images/language.svg"
    />
    <div class="flex flex-grow justify-center">
      <div class="flex items-center">
        <button
          class="mx-11 flex flex-row items-center"
          @click="showUploadModal = true"
        >
          <img
            class="w-20"
            src="../assets/images/upload.svg"
          />
          <p class="text-3xl font-medium text-primary">Upload</p>
        </button>
        <div class="h-20 w-[1px] bg-grey-light"></div>
        <button class="mx-11 flex flex-row items-center">
          <img
            class="w-20"
            src="../assets/images/voice.svg"
          />
          <p class="text-3xl font-medium text-primary">Record</p>
        </button>
      </div>
    </div>

    <!-- ファイルアップロードモーダル -->
    <div
      v-if="showUploadModal"
      class="fixed left-1/2 top-1/2 z-20 translate-x-[-50%] translate-y-[-80%] rounded-lg bg-grey-medium px-3 py-2 shadow-lg"
    >
      <button
        class="absolute right-[-2rem] top-[-2rem] w-8 cursor-pointer rounded-full shadow-lg hover:bg-red-600/40"
        @click="showUploadModal = false"
      >
        <img
          class="p-1"
          src="../assets/images/close_white.svg"
        />
      </button>
      <form
        @submit.prevent="handleSubmit"
        enctype="multipart/form-data"
        class="relative flex items-center space-x-3"
      >
        <div class="px-3 py-2">
          <input
            class="border-e-red-300 text-orange-white file:mr-4 file:rounded-md file:border-0 file:bg-grey-light file:px-4 file:py-2 file:text-sm file:text-orange-white"
            type="file"
            name="input_data"
            @change="handleFileChange"
          />
        </div>
        <button
          type="submit"
          class="rounded-full bg-primary px-2 py-2"
        >
          <img
            class="w-6"
            src="../assets/images/arrow_right.svg"
            alt=""
          />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const config = useRuntimeConfig();
  const selectedFile = ref<File | null>(null);
  const apiEndpoint = config.public.API_ENDPOINT_BASE_URL;
  const feedback = ref("");
  const router = useRouter();
  const dataToSend = useState("data", () => shallowRef(""));
  const showUploadModal = ref(false);
  const modalOn = ref(false);

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    selectedFile.value = input.files?.[0] ?? null; // ファイルが選択されていない場合はnullをセット しないと型エラーになる
    if (selectedFile.value) {
      console.log(selectedFile.value);
      // ここでファイルの操作を行う例として、コンソールにファイル情報を表示しています。
    }
  };

  onMounted(async () => {
    try {
      const res = await fetch(apiEndpoint + "/test");
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  });

  const handleSubmit = async () => {
    if (!selectedFile.value) {
      alert("ファイルを選択してください");
      return;
    }

    const formData = new FormData();
    formData.append("input_data", selectedFile.value);
    try {
      const response = await fetch(apiEndpoint + "/transcript", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") {
        dataToSend.value = await data.value;
        router.push("/feedback");
      } else if (data.status === "invalid") {
        throw new Error("このファイルは対応していません");
      } else {
        console.log(data.value);
        throw new Error("エラーが発生しました");
      }
    } catch (error) {
      alert(error);
    }
  };
</script>
