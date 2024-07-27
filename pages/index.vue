<template>
  <div
    v-if="showUploadModal || showRecordModal || isLoading"
    class="fixed inset-0 z-10 flex items-center justify-center bg-black/70"
  >
    <div
      v-if="isLoading"
      class="z-30 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-primary"
    ></div>
  </div>
  <div class="relative flex min-h-screen flex-col">
    <div class="flex flex-shrink justify-center"></div>
    <div class="flex flex-grow justify-center">
      <div class="flex items-center gap-6">
        <button
          class="mx-11 flex flex-col items-center transition-transform duration-300 hover:scale-125 hover:opacity-100"
          @click="showUploadModal = true"
        >
          <img
            class="aspect-square w-16 sm:w-24"
            src="../assets/images/upload.svg"
          />
          <p class="primary-shadow text-md text-primary">UPLOAD</p>
        </button>
        <button
          class="mx-11 flex flex-col items-center transition-transform duration-300 hover:scale-125 hover:opacity-100"
          @click="showRecordModal = true"
        >
          <img
            class="aspect-square w-16 sm:w-24"
            src="../assets/images/sounds.svg"
          />
          <p class="primary-shadow text-md text-primary">RECORD</p>
        </button>
      </div>
    </div>

    <!-- ファイルアップロードモーダル -->
    <div
      v-if="showUploadModal"
      class="fixed left-1/2 top-3/4 z-20 flex max-w-xs translate-x-[-50%] flex-col items-center justify-center gap-4"
    >
      <div class="relative rounded-md border border-primary px-3 shadow-lg">
        <button
          class="absolute right-[-1.5rem] top-[-1.7rem] w-6 cursor-pointer rounded-full shadow-lg hover:bg-red-600/40"
          @click="showUploadModal = false"
        >
          <img
            class="p-1 text-stone-300"
            src="../assets/images/close.svg"
          />
        </button>
        <form
          @submit.prevent="handleSubmit"
          enctype="multipart/form-data"
          class="relative flex items-center space-x-3"
        >
          <div class="px-2 py-3">
            <input
              class="text-sm text-stone-500 file:rounded-md file:border-0 file:bg-transparent file:px-3.5 file:py-2 file:text-sm file:text-primary file:underline file:decoration-1 file:hover:bg-primary/10"
              type="file"
              name="input_data"
              @change="handleFileChange"
            />
          </div>
          <button
            type="submit"
            class="rounded-full py-2"
          >
            <img
              class="absolute left-1/2 top-20 w-9 translate-x-[-50%] transition-transform duration-300 hover:scale-110"
              src="../assets/images/arrow-right-circle.svg"
              alt=""
            />
          </button>
        </form>
      </div>
    </div>

    <!-- 音声録音モーダル -->
    <div
      v-if="showRecordModal"
      class="fixed left-1/2 top-3/4 z-20 flex max-w-xs translate-x-[-50%] flex-col items-center justify-center gap-4"
    >
      <button
        class="absolute right-[-2rem] top-[-2rem] w-8 cursor-pointer rounded-full shadow-lg hover:bg-red-700/50"
        @click="closeRecordModal"
      >
        <img
          class="p-1"
          src="../assets/images/close.svg"
        />
      </button>
      <div
        v-if="doneRecording === false"
        class="flex flex-col items-center justify-between gap-3"
      >
        <div
          class="relative"
          @click="switchIsRecording()"
        >
          <button
            class="flex w-36 items-center space-x-2 rounded-md border border-primary px-2 py-1 hover:bg-primary/10"
            v-if="isRecording === false"
            @click="startRecording"
          >
            <img
              class="w-9"
              src="../assets/images/play.svg"
              alt=""
            />
            <p class="pb-0.5 pr-2 text-xl font-light text-primary">Record</p>
          </button>
          <button
            class="flex w-36 items-center space-x-2 rounded-md border border-[#ff0000] px-2 py-1 hover:bg-[#6f20203c]"
            v-else
            @click="stopRecording"
          >
            <img
              class="w-9"
              src="../assets/images/stop.svg"
              alt=""
            />
            <p class="pb-0.5 pr-2 text-xl font-light text-[#FF0000]">Pause</p>
          </button>
        </div>
        <button
          v-if="isRecorded === true"
          @click="finishRecording"
          type="submit"
          class="rounded-full px-3 py-1 text-sm font-light text-white/50 hover:bg-red-700/20 hover:text-white"
        >
          Finish Recording
        </button>
      </div>
      <div v-else>
        <form
          @submit.prevent="handleSubmit"
          enctype="multipart/form-data"
          class="relative items-center justify-between space-x-5"
        >
          <audio
            v-if="audioUrl"
            :src="audioUrl"
            controls
          ></audio>
          <button
            @click="finishRecording"
            type="submit"
          >
            <img
              class="absolute left-1/2 top-20 w-9 translate-x-[-50%] transition-transform duration-300 hover:scale-110"
              src="../assets/images/arrow-right-circle.svg "
              alt=""
            />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { AudioRecorder } from "./audioRecorder";

  const config = useRuntimeConfig();
  const selectedFile = ref<File | null>(null);
  const apiEndpoint = config.public.API_ENDPOINT_BASE_URL;
  const router = useRouter();
  const comment = useState("comment", () => shallowRef());
  const transcription = useState("transcription", () => shallowRef());
  const showUploadModal = ref(false);
  const showRecordModal = ref(false);
  const isRecording = ref(false);
  const doneRecording = ref(false);
  const recordedAudioFile = ref<File | null>(null);
  const isRecorded = ref(false);
  const isLoading = ref(false);

  const audioUrl = ref<string | null>("");
  const audioDuration = ref(0);
  const recorder = new AudioRecorder();

  const switchIsRecording = () => {
    isRecording.value = !isRecording.value;
  };

  const handleFileChange = (event: Event) => {
    try {
      const input = event.target as HTMLInputElement;
      selectedFile.value = input.files?.[0] ?? null; // ファイルが選択されていない場合はnullをセット しないと型エラーになる
    } catch (error) {
      console.log("【ファイル更新処理失敗】：" + error);
      alert("エラーが発生しました");
    }
  };

  const closeRecordModal = () => {
    showRecordModal.value = false;
    isRecording.value = false;
    doneRecording.value = false;
    isRecorded.value = false;
    recordedAudioFile.value = null;
  };

  const startRecording = async () => {
    await recorder.startRecording();
  };

  const stopRecording = async () => {
    try {
      await recorder.stopRecording();
      if (isRecorded.value === false) {
        audioUrl.value = await recorder.getAudioUrl();
        isRecorded.value = true;
      }
    } catch (error) {
      console.log("【録音停止処理失敗】：" + error);
      alert("エラーが発生しました");
    }
  };

  const finishRecording = async () => {
    try {
      audioDuration.value = await recorder.getDuration();
      audioUrl.value = await recorder.getAudioUrl();
      const audioBlob = await recorder.getBlob();
      recordedAudioFile.value = new File([audioBlob!], "recorded_audio.wav", {
        type: "audio/wav",
      });

      doneRecording.value = true;
    } catch (error) {
      console.log("【録音終了処理失敗】：" + error);
      alert("エラーが発生しました");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile.value && !recordedAudioFile.value) {
      alert("ファイルを選択するか、音声を録音してください");
      return;
    }
    isLoading.value = true;
    showUploadModal.value = false;
    showRecordModal.value = false;

    try {
      const formData = new FormData();
      if (selectedFile.value) {
        formData.append("input_data", selectedFile.value);
      } else if (recordedAudioFile.value) {
        formData.append("input_data", recordedAudioFile.value);
      }

      const response = await fetch(apiEndpoint + "/transcript", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.status === "success") {
        comment.value = await data.value.comment;
        transcription.value = await data.value.transcription;
        router.push("/comment");
      } else if (data.status === "invalid") {
        alert(data.value); // データが存在しません
      }
    } catch (error) {
      console.log("【ファイル送信処理失敗】：" + error);
      alert("エラーが発生しました");
    } finally {
      isLoading.value = false;
    }
  };
</script>

<style>
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .primary-shadow {
    text-shadow: #ff80009a 0 0 4px;
  }
</style>
